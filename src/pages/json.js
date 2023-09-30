import ReactPDF, { PDFDownloadLink } from "@react-pdf/renderer";
import { PDF } from "../components/Preview/Preview";
import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";

export const buildPDF = (formData, fontsPrefix) => {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const calculateTotal = () => {
    let sum = 0;
    formData.rows.forEach((row) => {
      sum += parseFloat(row.amount);
    });
    return numberWithCommas(sum.toFixed(2));
  };

  const total = calculateTotal();

  const pdf = (
    <PDF
      template={formData.template}
      rows={formData.rows}
      email={formData.email}
      businessName={formData.businessName}
      formName={formData.formName}
      logo={formData.logo}
      logoUpdated={false}
      address={formData.address}
      city={formData.city}
      zipcode={formData.zipcode}
      phone={formData.phone}
      owner={formData.owner}
      clientName={formData.clientName}
      clientEmail={formData.clientEmail}
      clientAddress={formData.clientAddress}
      clientCity={formData.clientCity}
      clientZipcode={formData.clientZipcode}
      clientPhone={formData.clientPhone}
      date={formData.date}
      InvoiceNo={formData.InvoiceNo}
      website={formData.website}
      notes={formData.notes}
      currencySymbol={formData.currencySymbol}
      totalAmount={total}
      fontsPrefix={fontsPrefix}
    />
  );
  return pdf;
};

export async function createTemplate(data, fontsPrefix) {
  return await ReactPDF.renderToStream(buildPDF(data, fontsPrefix));
}

export default function FromJson() {
  const { t, lang } = useTranslation("common");

  const [formData, setFormData] = useState({
    template: "template1",
    email: "hello@nilleb.com",
    businessName: "nillebco",
    formName: "Invoice",
    rows: Array(1).fill({ id: 0, quantity: 1, amount: "2000.00" }),
  });

  const [total, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // formData.template  = "template1" | "template2" | "template3" | "template4"
  // logoUpdated = true | false
  // logo = image src
  // formData.rows = Array(1).fill({ id: 0, quantity: 1, amount: "0.00" })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: JSON.parse(value) }));
  };

  return (
    <>
      <textarea
        name="formData"
        id="formData"
        onChange={handleChange}
        value={""}
        style={{
          height: "135px",
          marginTop: "18px",
          resize: "none",
          fontFamily: "Arial",
        }}
        placeholder={"Enter your JSON here"}
      ></textarea>

      {isClient && (
        <div>
          <PDFDownloadLink
            document={pdf}
            fileName={`${formData.clientName}_${formData.formName}.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <button disabled={!showPreview}>{t("download_pdf")}</button>
            )}
          </PDFDownloadLink>
        </div>
      )}
    </>
  );
}
