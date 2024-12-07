import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
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
          
          다음 형식으로 응답하세요:
          {
            "text": "대화 응답 텍스트(English)",
            "correction": "교정된 문장(English)",
            "feedback": "한국어로 된 피드백 (문법/문맥 적절성 포함)(Korean)",
            "contextually_appropriate": true
          }`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // 응답 데이터 검증 및 안전한 반환
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Invalid response from OpenAI');
    }

    return new Response(
      JSON.stringify({ content }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        content: JSON.stringify({
          text: "I'm sorry, there was an error. Could you try again?",
          correction: "",
          feedback: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
          contextually_appropriate: false
        })
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
