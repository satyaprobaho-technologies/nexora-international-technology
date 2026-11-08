import Link from "next/link";

export const metadata = { title: "Payment result | NEXORA" };

export default async function PaymentResult({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const paid = status === "paid";
  const review = status === "risk_review";
  return <main style={{maxWidth:680,margin:"12vh auto",padding:24,fontFamily:"Arial,sans-serif"}}>
    <h1>{paid ? "Payment verified" : review ? "Payment under security review" : "Payment not yet confirmed"}</h1>
    <p>{paid ? "Your payment has been verified by the payment provider. You can check your project status in the customer portal." : review ? "The provider flagged this transaction for review. NEXORA will verify it before marking the project as paid." : "A return from the payment page is not proof of payment. Please check your customer portal or contact NEXORA support."}</p>
    <Link href="/portal">Open customer portal</Link>
  </main>;
}
