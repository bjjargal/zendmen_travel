<template>
    <div class="p-4">
        <a-button type="primary" @click="generatePDF">Download Tour PDF</a-button>
    </div>
</template>

<script setup>
import { jsPDF } from "jspdf"

const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4")

    // 🏕 Logo
    const logoUrl = "/logo.png" // put your logo in /public or import it
    doc.addImage(logoUrl, "PNG", 260, 30, 80, 40)

    // 🧭 Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(18)
    doc.text("ZENDMEN TRAVEL MONGOLIA", 50, 70)

    doc.setFontSize(20)
    doc.text("Mongolia Adventure Tour", 50, 120)

    // 📝 Description
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    const description =
        "An unforgettable journey through Mongolia's diverse landscapes, from the bustling capital to remote desert dunes and majestic mountain ranges. Experience authentic nomadic culture, ancient traditions, and breathtaking natural wonders."
    doc.text(doc.splitTextToSize(description, 500), 50, 150)

    // 🧾 Details boxes
    const details = [
        { label: "Duration", value: "5 Days" },
        { label: "Total Distance", value: "1,370 km" },
        { label: "Group Size", value: "2–12 people" },
        { label: "Difficulty", value: "Easy–Moderate" },
    ]

    let y = 250
    details.forEach((item) => {
        // draw box
        doc.setDrawColor(230)
        doc.setLineWidth(1)
        doc.roundedRect(50, y, 500, 40, 6, 6)
        // text
        doc.setTextColor(120)
        doc.setFontSize(10)
        doc.text(item.label, 70, y + 15)
        doc.setTextColor(0)
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text(item.value, 70, y + 32)
        y += 60
    })

    // ✅ Save or preview
    doc.save("Mongolia-Adventure-Tour.pdf")
}
</script>
