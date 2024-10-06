'use client'
// import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"


export default function Home() {
  return (
    <>
      <main className="flex grow flex-col items-center justify-center px-4 md:px-24 py-12">
        <section>
          <h1 className="text-3xl font-bold text-center mb-8 md:mb-12">Dive into the world of anonymose conversations with our app</h1>
          <p className="text-lg text-center mb-12 md:mb-16">
            Experience the beauty of genuine connections, free from the constraints of real-world identities.
          </p>

        </section>

        <Carousel plugins={[Autoplay({ delay: 1500 })]} opts={{ align: 'start', loop: true }} className="w-full max-w-xs">
          <CarouselContent >
            {
              messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        {message.title}
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-lg font-semibold">{message.content}</span>
                      </CardContent>
                      <CardFooter>
                        {message.receivedTime}
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>


    </>
  );
}
