async function testAI() {
  const response = await fetch('https://ict-learner-ng.vercel.app/api/ai/generate-module', {
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
