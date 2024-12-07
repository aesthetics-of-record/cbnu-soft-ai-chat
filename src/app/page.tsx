import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-4'>
      <div className='max-w-3xl text-center space-y-8'>
        <h1 className='text-4xl font-bold tracking-tight sm:text-6xl text-gray-900'>
          AI English Conversation Practice
        </h1>

        <p className='text-lg leading-8 text-gray-600 max-w-2xl mx-auto'>
          AI와 함께하는 영어 회화 연습. 실시간 교정과 피드백으로 자연스러운 영어
          대화를 배워보세요.
        </p>

        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
            <div className='p-4 rounded-lg bg-white shadow-sm'>
              <h2 className='font-semibold mb-2'>실시간 대화</h2>
              <p className='text-gray-600'>
                자연스러운 영어 대화를 AI와 실시간으로 연습해보세요
              </p>
            </div>
            <div className='p-4 rounded-lg bg-white shadow-sm'>
              <h2 className='font-semibold mb-2'>즉각적인 교정</h2>
              <p className='text-gray-600'>
                문법, 어휘 사용의 오류를 실시간으로 교정받을 수 있습니다
              </p>
            </div>
            <div className='p-4 rounded-lg bg-white shadow-sm'>
              <h2 className='font-semibold mb-2'>상세한 피드백</h2>
              <p className='text-gray-600'>
                더 자연스러운 표현과 개선점에 대한 상세한 피드백을 받아보세요
              </p>
            </div>
          </div>

          <Link href='/chat' className='inline-block'>
            <Button size='lg' className='text-lg px-8'>
              대화 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
