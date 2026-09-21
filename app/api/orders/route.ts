import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In production with Neon, this executes:
    // await prisma.order.create({ data: { ... } });
    
    const mockOrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber: `LP-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName: body.clientName || "Valued Client",
      clientEmail: body.clientEmail || "client@example.com",
      sourceLanguage: body.sourceLanguage || "Spanish",
      targetLanguage: body.targetLanguage || "English",
      pageCount: body.pageCount || 1,
      totalAmount: body.totalAmount || 24.95,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Order placed successfully (Ready for Neon DB)",
      order: mockOrderRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
