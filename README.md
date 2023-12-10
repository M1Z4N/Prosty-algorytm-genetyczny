Pseudo kod algorytmu:

        while (liczbaOdpaleń) (40 razy np.) {
            let pokolenie = generujNowePokolenie();
            
            while (liczbaPopulacji) (30 razy np.){
                pokolenie.Mutuj().Krzyżuj();
            }

            let najlepszy = pokolenie.WybierzNajlepszego();
            ZapiszDoPliku(najlepszy);
        }

Disclaimer:

Dla funckji o paramaterach a=1, b=0, c=0 po pobraniu wyników zapisuje w pliku chińskie znaczki (najprawdopodobniej problem z kodowaniem).
