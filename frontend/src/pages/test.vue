<template>
    <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">PDF Demo Component</h2>

        <!-- Button to generate PDF -->
        <button class="px-4 py-2 bg-blue-600 text-white rounded mb-4" @click="generatePDF">
            Generate PDF
        </button>

        <!-- Optional: Show PDF inline via object/embed -->
        <div v-if="pdfUrl" class="mt-4">
            <h3 class="font-semibold mb-2">PDF Preview:</h3>
            <object :data="pdfUrl" type="application/pdf" width="100%" height="600px">
                <p>
                    PDF preview not available. <a :href="pdfUrl" target="_blank">Download PDF</a>
                </p>
            </object>
        </div>

        <!-- The component content to convert to PDF -->
        <div ref="pdfContent" id="pdfContent" class="p-4 border border-gray-300 rounded mt-4 bg-white">
            <h1 class="text-xl font-bold mb-2">Hello, Vue 3 PDF!</h1>
            <p>
                This content will be captured and converted to a PDF. You can include
                images, text, and any HTML/CSS styling.
            </p>
            <ul class="list-disc pl-5 mt-2">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ul>
            <!-- <img class="mt-2" src="https://via.placeholder.com/200" alt="Example" /> -->
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const pdfContent = ref(null);
const pdfUrl = ref('');

const generatePDF = async () => {
    if (!pdfContent.value) return;

    // Wait for next DOM update to ensure element exists
    await nextTick();

    try {
        // Convert the HTML content to canvas
        const canvas = await html2canvas(pdfContent.value, { scale: 2 });

        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');

        // Create jsPDF instance
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate width/height to fit A4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Convert to Blob and create object URL
        const blob = pdf.output('blob');
        pdfUrl.value = URL.createObjectURL(blob);

        // Optional: Open PDF in new tab
        // window.open(pdfUrl.value);
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
</script>

<style scoped>
/* Optional styling for demo */
#pdfContent {
    background-color: #fff;
}
</style>
