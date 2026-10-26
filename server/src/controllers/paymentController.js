import Stripe from "stripe";
import Course from "../models/Course.js";
import Order from "../models/Order.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const stripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY)
    throw Object.assign(
      new Error(
        "Stripe is not configured; add STRIPE_SECRET_KEY to server/.env",
      ),
      { statusCode: 503 },
    );
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};
export const createCheckout = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course || course.status !== "published")
    return res.status(404).json({ message: "Published course not found" });
  if (await Enrollment.exists({ student: req.user._id, course: course._id }))
    return res.status(409).json({ message: "You already own this course" });
  if (course.price <= 0)
    return res
      .status(400)
      .json({
        message: "This course is free; use the free enrollment endpoint",
      });
  const stripe = stripeClient();
  const order = await Order.create({
    student: req.user._id,
    course: course._id,
    amount: Math.round(course.price * 100),
    currency: "usd",
  });
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: course.title,
            description: course.subtitle || course.description.slice(0, 200),
            images: course.thumbnail?.startsWith("https://")
              ? [course.thumbnail]
              : [],
          },
          unit_amount: Math.round(course.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: order._id.toString(),
      studentId: req.user._id.toString(),
      courseId: course._id.toString(),
    },
    client_reference_id: order._id.toString(),
    success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/courses/${course.slug}?payment=cancelled`,
  });
  order.stripeSessionId = session.id;
  await order.save();
  res.json({ url: session.url });
});
export const enrollFree = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course || course.status !== "published")
    return res.status(404).json({ message: "Course not found" });
  if (course.price > 0)
    return res.status(400).json({ message: "This course requires payment" });
  await Enrollment.updateOne(
    { student: req.user._id, course: course._id },
    { $setOnInsert: { student: req.user._id, course: course._id } },
    { upsert: true },
  );
  res.status(201).json({ message: "Enrolled successfully" });
});
export async function handleStripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripeClient().webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res
      .status(400)
      .send(`Webhook signature verification failed: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid" && session.metadata?.orderId) {
      const order = await Order.findById(session.metadata.orderId);
      const metadataMatches =
        order &&
        String(order.student) === String(session.metadata.studentId) &&
        String(order.course) === String(session.metadata.courseId);
      const sessionMatches =
        order &&
        (!order.stripeSessionId || order.stripeSessionId === session.id);
      if (metadataMatches && sessionMatches) {
        if (order.status !== "paid") {
          order.status = "paid";
          order.stripePaymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id;
          await order.save();
        }
        // Always ensure enrollment exists, including on Stripe webhook retries after a partial failure.
        const enrollmentResult = await Enrollment.updateOne(
          { student: order.student, course: order.course },
          {
            $setOnInsert: {
              student: order.student,
              course: order.course,
              order: order._id,
            },
          },
          { upsert: true },
        );
        if (enrollmentResult.upsertedCount === 1)
          await Course.findByIdAndUpdate(order.course, {
            $inc: { enrollmentCount: 1 },
          });
      }
    }
  }
  return res.json({ received: true });
}
