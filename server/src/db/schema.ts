import {
  uuid,
  pgTable,
  varchar,
  boolean,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  surname: varchar("surname", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("patient"),
  sex: varchar("sex", { length: 10 }).notNull(), // Male | Female | Other
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const otpTable = pgTable("otp_codes", {
  id: uuid("id").defaultRandom().primaryKey(),

  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id),

  otp: text("otp").notNull(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id),
  doctorName: varchar("doctor_name", { length: 100 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  time: varchar("time", { length: 50 }).notNull(),
  symptoms: text("symptoms"),
  status: varchar("status", { length: 20 }).default("pending"), // pending | completed | cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiSuggestions = pgTable("ai_suggestions", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id),
  symptoms: text("symptoms").notNull(),
  possibleConditions: text("possible_conditions").notNull(), // JSON string
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medicalHistory = pgTable("medical_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patients.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }), // AI | Doctor | Manual
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
