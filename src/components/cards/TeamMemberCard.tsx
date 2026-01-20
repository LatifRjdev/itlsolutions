import Image from "next/image";
import { Linkedin, Github } from "lucide-react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string | null;
  github?: string | null;
}

export function TeamMemberCard({
  name,
  role,
  bio,
  image,
  linkedin,
  github,
}: TeamMemberCardProps) {
  return (
    <div className="group bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-[var(--foreground)]">{name}</h3>
        <p className="text-[var(--primary)] font-medium text-sm mb-3">{role}</p>
        <p className="text-[var(--foreground-secondary)] text-sm mb-4">{bio}</p>

        <div className="flex gap-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="size-8 rounded-full bg-[var(--background)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="size-8 rounded-full bg-[var(--background)] flex items-center justify-center text-[var(--foreground-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
