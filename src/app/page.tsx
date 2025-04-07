// pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import Counter from '@/components/counter';

const Home: NextPage = () => {
  return (
    <div className="container">
      <Head>
        <title>Next.js Testing Demo</title>
        <meta name="description" content="A demo of automated testing in Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to Next.js Testing Demo
        </h1>

        <p className="description">
          Learn how to test Next.js applications
        </p>

        <div className="demo">
          <Counter />
        </div>
      </main>
    </div>
  )
}

export default Home