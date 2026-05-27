// // CREATE APPOINTMENT
// export const createAppointment = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     const { patientId, doctorName, date, time, symptoms } = req.body;

//     const appointment = await db
//       .insert(appointments)
//       .values({
//         patientId,
//         doctorName,
//         date,
//         time,
//         symptoms,
//         status: "pending",
//       })
//       .returning();

//     res.status(201).json(appointment[0]);
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
