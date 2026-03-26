async function testAI() {
  const response = await fetch('http://localhost:3000/api/ai/generate-module', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Introduction to Spreadsheets',
      contextOptions: ['Lagos Market Trader', 'Cyber Cafe operator', 'Banker']
    })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
testAI();
