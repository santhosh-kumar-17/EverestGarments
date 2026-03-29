import nodemailer from 'nodemailer';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: OrderItem[];
  createdAt: Date;
}

const NOTIFICATION_EMAIL = 'devateverest@gmail.com';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toFixed(2)}`;
}

function buildOrderEmailHtml(order: OrderEmailData): string {
  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f5; font-family: 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1a1a2e;">
          ${item.name}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f5; font-family: 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #6b7280; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f5; font-family: 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #6b7280; text-align: right;">
          ${formatCurrency(item.price)}
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #f0f0f5; font-family: 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1a1a2e; font-weight: 600; text-align: right;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f8; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f8;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 32px 40px; text-align: center;">
                <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                  🛍️ New Order Received!
                </h1>
                <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.9);">
                  Order #${order.orderId.slice(-8).toUpperCase()}
                </p>
              </td>
            </tr>

            <!-- Order Summary Banner -->
            <tr>
              <td style="padding: 24px 40px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #f0f4ff 0%, #ede9fe 100%); border-radius: 12px;">
                  <tr>
                    <td style="padding: 20px 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="font-family: 'Segoe UI', Roboto, sans-serif;">
                            <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; font-weight: 600;">Total Amount</p>
                            <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1a1a2e;">${formatCurrency(totalAmount)}</p>
                          </td>
                          <td style="text-align: right; font-family: 'Segoe UI', Roboto, sans-serif;">
                            <p style="margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; font-weight: 600;">Date</p>
                            <p style="margin: 0; font-size: 14px; color: #374151;">${orderDate}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Customer Details -->
            <tr>
              <td style="padding: 28px 40px 0;">
                <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; display: inline-block;">
                  Customer Details
                </h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                      <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">${order.customerName}</p>
                    </td>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                      <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-weight: 600;">${order.phone}</p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 8px 0;">
                      <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Address</p>
                      <p style="margin: 0; font-size: 15px; color: #1a1a2e;">${order.address}</p>
                    </td>
                  </tr>
                  ${
                    order.notes
                      ? `<tr>
                    <td colspan="2" style="padding: 8px 0;">
                      <p style="margin: 0 0 2px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Notes</p>
                      <p style="margin: 0; font-size: 15px; color: #1a1a2e; font-style: italic;">${order.notes}</p>
                    </td>
                  </tr>`
                      : ''
                  }
                </table>
              </td>
            </tr>

            <!-- Order Items -->
            <tr>
              <td style="padding: 28px 40px 0;">
                <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: #1a1a2e; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; display: inline-block;">
                  Order Items
                </h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-radius: 8px; overflow: hidden; border: 1px solid #f0f0f5;">
                  <thead>
                    <tr style="background-color: #f8f9fc;">
                      <th style="padding: 10px 16px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Product</th>
                      <th style="padding: 10px 16px; text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Qty</th>
                      <th style="padding: 10px 16px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Price</th>
                      <th style="padding: 10px 16px; text-align: right; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f8f9fc;">
                      <td colspan="3" style="padding: 14px 16px; text-align: right; font-size: 15px; font-weight: 700; color: #1a1a2e;">
                        Grand Total
                      </td>
                      <td style="padding: 14px 16px; text-align: right; font-size: 18px; font-weight: 700; color: #6366f1;">
                        ${formatCurrency(totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <!-- Action Required -->
            <tr>
              <td style="padding: 28px 40px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #92400e;">⚡ Action Required</p>
                      <p style="margin: 0; font-size: 13px; color: #a16207;">Please contact the customer at <strong>${order.phone}</strong> to confirm the order, discuss payment options, and arrange delivery.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #1f2937; padding: 24px 40px; text-align: center;">
                <p style="margin: 0 0 4px; font-size: 14px; color: #d1d5db;">Everest Garments</p>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">Premium Textile Collection • Automated Order Notification</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
}

export async function sendOrderNotificationEmail(
  order: OrderEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPass) {
      console.warn(
        'Email credentials not configured. Skipping email notification.'
      );
      return {
        success: false,
        error: 'Email credentials not configured',
      };
    }

    const transporter = createTransporter();

    const totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const mailOptions = {
      from: `"Everest Garments" <${emailUser}>`,
      to: NOTIFICATION_EMAIL,
      subject: `🛍️ New Order #${order.orderId.slice(-8).toUpperCase()} - ${order.customerName} (${formatCurrency(totalAmount)})`,
      html: buildOrderEmailHtml(order),
    };

    await transporter.sendMail(mailOptions);
    console.log(
      `Order notification email sent for order ${order.orderId}`
    );
    return { success: true };
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    };
  }
}
