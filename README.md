Pseudo kod algorytmu:

while (liczbaOdpaleń) (40 razy)
        {
            let pokolenie = generujNowePokolenie();
            
            while (liczbaPopulacji) (30 razy np)
            {
                pokolenie.Mutuj().Krzyżuj();
            }

            let najlepszy = pokolenie.WybierzNajlepszego();
            
            ZapiszDoPliku(najlepszy);
        }
