import * as Tone from "tone";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toneRef = useRef<Tone.Sampler | null>(null);
  useEffect(() => {
    toneRef.current = new Tone.Sampler({
      urls: {
        C4: "C4.ogg",
        E3: "E4.ogg",
        G4: "G4.ogg",
      },
      baseUrl: "/instrument/",
    }).toDestination();
  }, []);
  const [isKeyPressed, setIsKeyPressed] = useState({
    z: false,
    c: false,
    b: false,
  });
  const handlePlayBackgroundAudio = () => {
    if (audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.log(error);
        });
      }
    }
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === "z" && !isKeyPressed.z) {
      toneRef.current?.triggerAttack("C4");
      setIsKeyPressed((prev) => ({
        ...prev,
        z: true,
      }));
    }
    if (event.key === "c" && !isKeyPressed.c) {
      toneRef.current?.triggerAttack("E4");
      setIsKeyPressed((prev) => ({
        ...prev,
        c: true,
      }));
    }
    if (event.key === "b" && !isKeyPressed.b) {
      toneRef.current?.triggerAttack("G4");
      setIsKeyPressed((prev) => ({
        ...prev,
        b: true,
      }));
    }
  };

  const handleKeyUp = (event: { key: string }) => {
    if (event.key === "z") {
      toneRef.current?.triggerRelease("C4");
      setIsKeyPressed((prev) => ({
        ...prev,
        z: false,
      }));
    }
    if (event.key === "c") {
      toneRef.current?.triggerRelease("E4");
      setIsKeyPressed((prev) => ({
        ...prev,
        c: false,
      }));
    }
    if (event.key === "b") {
      toneRef.current?.triggerRelease("G4");
      setIsKeyPressed((prev) => ({
        ...prev,
        b: false,
      }));
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isKeyPressed]);
  console.log(audioRef.current);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      Press Z, B, or C
      <div>
        <audio ref={audioRef} loop autoPlay>
          <source src="/cmajor-background.ogg" type="audio/ogg" />
        </audio>
      </div>
      <button onClick={handlePlayBackgroundAudio}>Play Audio</button>
    </main>
  );
}
