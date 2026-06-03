export const doctorLoginTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Doctor Account Created</title>
</head>

<body style="font-family: Arial; background:#f4f4f4; padding:20px;">

  <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:10px;">

    <h2 style="color:#2563eb;">Welcome to MediCare 👨‍⚕️👩‍⚕️</h2>

    <p>Hello <b>{{name}}</b>,</p>

    <p>Your doctor account has been created successfully.</p>

    <hr/>

    <h3>Login Details</h3>

    <p><b>Email:</b> {{email}}</p>
    <p><b>Password:</b> {{password}}</p>

    <p style="color:red;">
       Please change your password after first login.
    </p>

    <br/>

    <p>Regards,<br/>MediCare Team</p>

  </div>

</body>
</html>
`;
