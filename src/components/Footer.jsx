import React from 'react';
import { ExternalLink, Heart, Shield, Code, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 px-6 py-6 mt-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-cyan-400">
            <Code className="w-3.5 h-3.5" />
          </div>
          <span>
            <strong className="text-white font-semibold">VOKAN 3D Anatomy</strong> — Open Source Fitness Engine under{' '}
            <a
              href="https://opensource.org/licenses/MIT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              MIT License
            </a>
          </span>
        </div>

        {/* References Attribution */}
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span>
            Anatomy References & Models:{' '}
            <a
              href="https://sketchfab.com/3d-models/myology-31b40fd809b14665b93773936d67c52c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline inline-flex items-center gap-1"
            >
              Sketchfab Myology <ExternalLink className="w-2.5 h-2.5" />
            </a>
            {' & '}
            <a
              href="https://z-anatomy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              Z-Anatomy Atlas <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </span>
          <span className="text-slate-600">|</span>
          <a
            href="https://github.com/ratharo-gitty/VOKAN-3D-Anatomy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 font-mono"
          >
            <Github className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
