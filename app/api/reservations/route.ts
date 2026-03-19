import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, guests, occasion, message } = body;

    // Validation
    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    if (guests < 1 || guests > 20) {
      return NextResponse.json(
        { error: "Le nombre de couverts doit etre entre 1 et 20." },
        { status: 400 }
      );
    }

    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return NextResponse.json(
        { error: "La date de reservation ne peut pas etre dans le passe." },
        { status: 400 }
      );
    }

    // Save to database
    const reservation = await prisma.reservation.create({
      data: {
        name,
        phone,
        email: email || null,
        date: reservationDate,
        time,
        guests,
        occasion: occasion || null,
        message: message || null,
      },
    });

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const formattedDate = reservationDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      await transporter.sendMail({
        from: `"La Belle Assiette" <${process.env.SMTP_USER}>`,
        to: process.env.RESTAURANT_EMAIL || "khuddan@gmail.com",
        subject: `Nouvelle reservation - ${name}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D4A35;">Nouvelle reservation</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #7A7A7A;">Nom</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
              <tr><td style="padding: 8px 0; color: #7A7A7A;">Telephone</td><td style="padding: 8px 0;">${phone}</td></tr>
              ${email ? `<tr><td style="padding: 8px 0; color: #7A7A7A;">Email</td><td style="padding: 8px 0;">${email}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; color: #7A7A7A;">Date</td><td style="padding: 8px 0;">${formattedDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #7A7A7A;">Heure</td><td style="padding: 8px 0;">${time}</td></tr>
              <tr><td style="padding: 8px 0; color: #7A7A7A;">Couverts</td><td style="padding: 8px 0;">${guests}</td></tr>
              ${occasion ? `<tr><td style="padding: 8px 0; color: #7A7A7A;">Occasion</td><td style="padding: 8px 0;">${occasion}</td></tr>` : ""}
              ${message ? `<tr><td style="padding: 8px 0; color: #7A7A7A;">Message</td><td style="padding: 8px 0;">${message}</td></tr>` : ""}
            </table>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #7A7A7A; font-size: 14px;">Reservation #${reservation.id} — Statut : En attente</p>
          </div>
        `,
      });
    } catch (emailError) {
      // Log but don't fail the reservation if email fails
      console.error("Erreur envoi email:", emailError);
    }

    return NextResponse.json(
      { message: "Reservation enregistree avec succes.", id: reservation.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur reservation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez reessayer." },
      { status: 500 }
    );
  }
}
