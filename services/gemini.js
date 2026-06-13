export async function suggestCategories(extractedText) {
  console.log('Texto extraído:', extractedText);
  return [
    { description: "Supermercado Extra", amount: 350.50, type: "expense", suggestedCategory: "Alimentação", confidence: 95 },
    { description: "Uber Viagem", amount: 45.90, type: "expense", suggestedCategory: "Transporte", confidence: 98 },
    { description: "Salário", amount: 8500.00, type: "income", suggestedCategory: "Salário", confidence: 99 },
  ];
}

export async function extractTextFromPDF(fileUri) {
  return "Supermercado Extra - R$ 350,50\nUber - R$ 45,90\nSalário - R$ 8.500,00";
}
