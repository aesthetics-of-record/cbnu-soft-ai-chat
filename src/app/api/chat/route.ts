import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `당신은 영어 교사입니다. 
        1. 사용자와 자연스러운 대화를 이어가면서 
        2. 사용자의 영어 문장이 대화의 문맥에 맞는지 판단하고
        3. 문법적 오류나 개선점에 대해 한국어로 피드백을 제공해야 합니다.
        
        응답 형식:
        {
          "text": "대화 응답 텍스트(English)",
          "correction": "교정된 문장(English)",
          "feedback": "한국어로 된 피드백 (문법/문맥 적절성 포함)(Korean)",
          "contextually_appropriate": true/false
        }`,
      },
      ...messages,
    ],
  });

  return Response.json(response.choices[0].message);
}
