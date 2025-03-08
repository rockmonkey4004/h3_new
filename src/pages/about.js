import Head from 'next/head';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Me | Health, Healing, and Hope</title>
        <meta name="description" content="Learn about Laura Sanders, the founder of Health, Healing, and Hope (H3). Discover my wellness journey and how I found healing through paleo living and lifestyle changes." />
      </Head>

      <div className="container-narrow py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">About Me</h1>
        
        <div className="relative w-full h-96 rounded-xl overflow-hidden mb-8">
          <Image 
            src="https://res.cloudinary.com/rockmonkey/image/upload/v1587782937/Blog/spring-flower_rj4zsg.jpg"
            alt="Laura holding fresh picked strawberries"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        
        <div className="prose prose-lg max-w-none">
          <p>
            Hi!
          </p>

          <p>
            I am so thankful you stopped by! My name is Laura and I am the founder of Health, Healing, and Hope (H3). 
            I am a lover of paleo treats, coffee, the beach and all things wellness.
          </p>

          <p>
            A little background on me- I was born and raised in Alaska but now live in Music City (Nashville, Tennessee). 
            I journeyed for the last 7 years to find a restoration of health, increased healing, and a renewed hope.
          </p>

          <p>
            When I was 20, I started to experience physical pain, exhaustion, memory issues, weight gain, and other 
            unexplainable symptoms. After years of seeing doctor after doctor, I finally learned about hypothyroidism, 
            adrenal fatigue, IBS and fibromyalgia. The next day, I started a whole new way of eating by trying to avoid 
            anything causing inflammation. My doctor called it a "Paleo lifestyle" with a focus on nutrient dense foods 
            to heal my body.
          </p>

          <p>
            Since then, I discovered a parasitic infection from my time spent overseas. Through all these years, I changed 
            my entire lifestyle. I approached managing stress, sleep, food choice, and physical activity through a different 
            lens. I experienced seasons of bedridden days, saying "no" to 90% of social invitations, and only being able to 
            walk for exercise. Now, I feel like I can clean the house and run in the same day.
          </p>

          <p>
            Even though it has been 7 years, I am still learning about tailoring a personal approach to health. These 
            changes did not take place over night. It took years. Although I saw tremendous healing, especially this last 
            year, I believe I will continue on the journey of healing for my physical body, my spirit and my soul. I also 
            found hope, even in the tough days I spent in bed, or was told by a doctor nothing was wrong with me. Learning 
            to seek hope in the darkness brought me strength to keep fighting.
          </p>

          <p>
            I am so excited you are here. I hope you will join me and start your own journey of H3.
            Let us take this journey together. Let us grow, learn, challenge and encourage one another on our journeys of 
            health, healing and hope.
          </p>
        </div>
      </div>
    </>
  );
} 