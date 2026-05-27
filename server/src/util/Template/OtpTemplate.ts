export const otpTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OTP Verification</title>

    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f5f7fb;
        font-family: Arial, Helvetica, sans-serif;
      }

      table {
        border-collapse: collapse;
      }

      .container {
        width: 600px;
      }

      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 0 12px !important;
        }

        .otp {
          font-size: 28px !important;
          letter-spacing: 4px !important;
        }
      }
    </style>
  </head>

  <body>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding: 40px 10px">
          <!-- Card -->
          <table
            class="container"
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            style="
              background: #ffffff;
              border-radius: 14px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            ">
            <!-- HEADER -->
            <tr>
              <td
                style="
                  padding: 28px;
                  text-align: center;
                  background: linear-gradient(135deg, #0f172a, #1e293b);
                ">
                <h1
                  style="
                    margin: 0;
                    font-size: 20px;
                    color: #ffffff;
                    letter-spacing: 0.5px;
                  ">
                  {{company_name}} Security Verification
                </h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding: 36px 28px">
                <h2 style="margin: 0 0 10px; color: #0f172a; font-size: 18px">
                  Hello {{email}},
                </h2>

                <p
                  style="
                    margin: 0 0 20px;
                    color: #475569;
                    font-size: 14px;
                    line-height: 1.6;
                  ">
                  Use the verification code below to continue your action. This
                  code is valid for <strong>5 minutes</strong>.
                </p>

                <!-- OTP BOX -->
                <div
                  class="otp"
                  style="
                    text-align: center;
                    font-size: 38px;
                    font-weight: 700;
                    letter-spacing: 8px;
                    color: #0f172a;
                    background: #f1f5f9;
                    padding: 18px 24px;
                    border-radius: 10px;
                    border: 1px dashed #cbd5e1;
                    margin: 30px 0;
                  ">
                  {{otp_code}}
                </div>

                <p
                  style="
                    margin: 0;
                    font-size: 13px;
                    color: #64748b;
                    line-height: 1.5;
                  ">
                  If you did not request this code, you can safely ignore this
                  email. No action is required.
                </p>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                style="
                  padding: 18px;
                  text-align: center;
                  font-size: 12px;
                  color: #94a3b8;
                  background: #f8fafc;
                ">
                <p style="margin: 0">
                  © {{year}} {{company_name}}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
          <!-- /Card -->
        </td>
      </tr>
    </table>
  </body>
</html>

`;
