import React, { useContext, useEffect } from "react";
import PaiSelectionContext, { PaiOptionInfo, PaiOptionType } from "../Context/PaiSelectionContext";
import { PaiGenerator } from "../../Utilities/PaiGenerator";
import { OneToNine, PaiGroupName, PaiName } from "../../@types/types";
import { PaiPatternExtractor } from "../../Runtime/Extractor/Extractor";

const KeyboardShortcutSupportedForSelectionPai = () => {
  const [paiSelections, setPaiSelections] = useContext(PaiSelectionContext);

  // NOTE: Here is implementation of shortcut keys
  useEffect(() => {
    let previousKeyCode: string | null = null

    // NOTE: Shortcut helping type.
    //  a: include AkaDora
    //  f: is furo
    //  c: is kantsu (can two)
    //  d: is dora
    //  u: is ura-dora
    //  h: is hora-pai
    //  k: fill by koutsu
    //  s: fill by shuntsu
    let modes: ('a' | 'k' | 's' | 'f' | 'c' | 'h' | 'd' | 'u')[] = []

    const event = (e: KeyboardEvent) => {
      if (['p', 'm', 's', 'z'].includes(e.key) && (Number(previousKeyCode) > 0 && Number(previousKeyCode) <= 9)) {
        const number = Number(previousKeyCode)
        const type = e.key as unknown as PaiGroupName

        const completionPai = `${previousKeyCode}${e.key}` as PaiName

        let registerPais: PaiOptionType['paiList']  = paiSelections?.paiList ?? []
        let paiNames: PaiName[] = []

        if (modes.includes('s') && e.key !== 'z') {
          // NOTE: Make shuntsu
          paiNames = new PaiGenerator(`${number}` as OneToNine, `${Math.min(number + 2, 9)}` as OneToNine, type).generate()
        } else if (modes.includes('k')) {
          // NOTE: Make koutsu
          paiNames = [completionPai, completionPai, completionPai]
        } else if (modes.includes('c')) {
          // NOTE: Make kantsu
          paiNames = [completionPai, completionPai, completionPai, completionPai]
        } else {
          paiNames = [completionPai]
        }

        const needsRinshanPai = PaiPatternExtractor.needsRinshanPaiByPaiNameList(
          registerPais
            .filter((v) => v.pai)
            .map((v) => `${v.pai}${v.isKanPai ? "k" : ""}` as PaiName),
        );

        for (let i = 0; i < Math.min(14 + needsRinshanPai, paiNames.length); i++) {
          const paiName = paiNames[i]
          const [number] = PaiPatternExtractor.extractPaiPair(paiName)

          const isHoraPai = modes.includes('h')
          const isAkaDora = !registerPais.find(paiOptionInfo => paiOptionInfo.isAkaDora) && modes.includes('a') && number === '5'

          // NOTE: Akadora is always indexed 3
          const index = isAkaDora
            ? 3
            : registerPais.filter((pai: PaiOptionInfo) => {
              return pai.pai === paiName
            }).length

          // NOTE: Pais are not available greater than 4 counts
          if (index >= 4) {
            continue;
          }

          // NOTE: When pai is hora, clean-up fill to false previously pais
          if (isHoraPai) {
            registerPais = registerPais.map(paiOptionInfo => ({
              ...paiOptionInfo,
              isHoraPai: false,
            }))
          }

          registerPais.push({
            pai: paiName,
            index,
            isFuro: i === 0 && modes.includes('f'),
            isAkaDora,
            isHoraPai,
            isDoraPai: paiName === completionPai && modes.includes('d'),
            isUraDoraPai: paiName === completionPai && modes.includes('u'),
            isKanPai: modes.includes('c'),
          })
        }

        setPaiSelections?.({
          ...(paiSelections ?? {}),
          paiList: registerPais,
        })

        // NOTE: to be initial
        modes = []
      } else if (e.key === 'a' || e.key === 'k' || e.key === 's' || e.key === 'f' || e.key === 'd' || e.key === 'u' || e.key === 'h' || e.key === 'c') { // NOTE: The type guard not supported with arr.includes
        modes.push(e.key)
      }

      previousKeyCode = e.key
    }

    document.addEventListener('keyup', event)

    return () => {
      document.removeEventListener('keyup', event)
    }
  }, [paiSelections]);

  return <></>
}

export default KeyboardShortcutSupportedForSelectionPai
