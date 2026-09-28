import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Sun, Moon, Monitor, Palette, Calculator, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, actualTheme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Pengaturan Sistem</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Preferensi tampilan tema aplikasi dan parameter akademik
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Tema Tampilan (Light & Dark Mode)
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Pilih tema tampilan yang paling nyaman untuk mata Anda saat menggunakan aplikasi
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Light Option */}
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                theme === 'light'
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Sun className="w-5 h-5 text-amber-500" />
                {theme === 'light' && <Badge variant="blue" size="sm">Dipilih</Badge>}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Mode Terang (Light)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latar belakang terang bersih dengan kontras optimal
                </p>
              </div>
            </button>

            {/* Dark Option */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                theme === 'dark'
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Moon className="w-5 h-5 text-blue-400" />
                {theme === 'dark' && <Badge variant="blue" size="sm">Dipilih</Badge>}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Mode Gelap (Dark)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nuansa slate gelap dengan aksen biru yang elegan
                </p>
              </div>
            </button>

            {/* System Option */}
            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                theme === 'system'
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border bg-card hover:bg-muted/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Monitor className="w-5 h-5 text-primary" />
                {theme === 'system' && <Badge variant="blue" size="sm">Dipilih</Badge>}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">Otomatis (Sistem)</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Menyesuaikan pengaturan sistem operasi Anda ({actualTheme})
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Grading Formula Parameters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calculator className="w-4 h-4 text-primary" />
            Parameter Pembobotan Nilai Akademik
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Standar rumus perhitungan nilai akhir kurikulum yang terpusat di server
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">Bobot Nilai Tugas</span>
              <p className="text-2xl font-bold text-foreground mt-1">30%</p>
              <span className="text-[11px] text-muted-foreground">Faktor pengali 0.30</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">Bobot Nilai UTS</span>
              <p className="text-2xl font-bold text-foreground mt-1">30%</p>
              <span className="text-[11px] text-muted-foreground">Faktor pengali 0.30</span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">Bobot Nilai UAS</span>
              <p className="text-2xl font-bold text-foreground mt-1">40%</p>
              <span className="text-[11px] text-muted-foreground">Faktor pengali 0.40</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 text-xs text-muted-foreground flex items-center gap-2.5">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <span>
              Perhitungan nilai akhir dievaluasi secara otomatis setiap kali guru menyimpan nilai komponen pada skala 0–100.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
