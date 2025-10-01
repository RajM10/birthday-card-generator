"use client";
import Blow from "@/components/Blow";
import Cake from "@/components/Cake";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function BirthdayCake() {
  const TIMER = 8;
  const [showBlow, setShowBlow] = useState<boolean>(false);
  const [isBlow, setIsBlow] = useState<boolean>(false);
  const windBlown = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBlow(true);
    }, TIMER * 1000);

    async function detectWind() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        const data = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        function checkForWind() {
          analyser.getByteFrequencyData(data);

          let lowFreqEnergy = 0;
          for (let i = 0; i < 10; i++) {
            lowFreqEnergy += data[i];
          }

          if (lowFreqEnergy > 1500) {
            windBlown.current++;
            if (windBlown.current > 34) {
              // Clean up audio before redirecting
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
              }
              if (audioContextRef.current) {
                audioContextRef.current.close();
              }
              setIsBlow(true);
              setShowBlow(false);
              redirect(`/view/${id}/wish`);
            }
          }

          requestAnimationFrame(checkForWind);
        }

        checkForWind();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }

    detectWind();

    return () => {
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [id]);

  return (
    <div className='absolute h-dvh w-dvw bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950'>
      <Cake isBlown={isBlow} />
      {showBlow && <Blow />}
    </div>
  );
}

export default BirthdayCake;
