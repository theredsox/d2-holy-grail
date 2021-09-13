import { IItem } from "../definitions/IItem";
import { Item } from "../definitions/Item";
import { ItemScores } from "../ItemScores";

export class MissingItems {
  public missing: number = 0;
  public score: number = 0;
  public found: number = 0;
  public foundBits: string = "";
  public itemScores: number[] = [];

  public constructor() {}
}

export class ItemScoreCalculator {
  public constructor() {}

  public static formatGrailForParty = (data: any): any => {
    let partyGrailData = {
      uniqueArmor: {
        missing: 123,
        foundBits: "",
        itemScores: []
      },
      uniqueWeapons: {
        missing: 197,
        foundBits: "",
        itemScores: []
      },
      uniqueOther: {
        missing: 59,
        foundBits: "",
        itemScores: []
      },
      sets: {
        missing: 127,
        foundBits: "",
        itemScores: []
      },
      runes: {
        missing: 33,
        foundBits: "",
        itemScores: []
      },
      itemScore: 0
    };
    if (data && data.uniques) {
      if (data.uniques.weapons) {
        let missingWeps = ItemScoreCalculator.sumMissing(
          () => data.uniques.weapons,
          new MissingItems()
        );
        partyGrailData.uniqueWeapons.foundBits = missingWeps.foundBits;
        partyGrailData.uniqueWeapons.missing = missingWeps.missing;
        partyGrailData.uniqueWeapons.itemScores = missingWeps.itemScores;
        partyGrailData.itemScore += missingWeps.score;
      }
      if (data.uniques.armor) {
        let missingArmor = ItemScoreCalculator.sumMissing(
          () => data.uniques.armor,
          new MissingItems()
        );
        partyGrailData.uniqueArmor.foundBits = missingArmor.foundBits;
        partyGrailData.uniqueArmor.missing = missingArmor.missing;
        partyGrailData.uniqueArmor.itemScores = missingArmor.itemScores;
        partyGrailData.itemScore += missingArmor.score;
      }
      if (data.uniques.other) {
        let missingOther = ItemScoreCalculator.sumMissing(
          () => data.uniques.other,
          new MissingItems()
        );
        partyGrailData.uniqueOther.foundBits = missingOther.foundBits;
        partyGrailData.uniqueOther.missing = missingOther.missing;
        partyGrailData.uniqueOther.itemScores = missingOther.itemScores;
        partyGrailData.itemScore += missingOther.score;
      }
    }
    if (data && data.sets) {
      let missingSets = ItemScoreCalculator.sumMissing(
        () => data.sets,
        new MissingItems()
      );
      partyGrailData.sets.foundBits = missingSets.foundBits;
      partyGrailData.sets.missing = missingSets.missing;
      partyGrailData.sets.itemScores = missingSets.itemScores;
      partyGrailData.itemScore += missingSets.score;
    }
    if (data && data.runes) {
      let missingRunes = ItemScoreCalculator.sumMissing(
        () => data.runes,
        new MissingItems()
      );
      partyGrailData.runes.foundBits = missingRunes.foundBits;
      partyGrailData.runes.missing = missingRunes.missing;
      partyGrailData.runes.itemScores = missingRunes.itemScores;
      partyGrailData.itemScore += missingRunes.score;
    }
    return partyGrailData;
  };

  public static sumMissing = (
    dataFunc: () => any,
    missing: MissingItems,
    category?: string
  ): MissingItems => {
    let data = {};
    try {
      data = dataFunc();
    } catch (e) {
      // ignore error
    }

    if (!data) {
      return missing;
    }

    Object.keys(data).forEach((key, index) => {
      const possibleItem = data[key] as IItem;
      if (ItemScoreCalculator.isItem(possibleItem)) {
        if (!possibleItem.wasFound) {
          missing.missing++;
          missing.foundBits += "0";
          missing.itemScores.push(0);
        } else {
          missing.found++;
          missing.foundBits += "1";
          let itemScore = ItemScores[key];
          if (!itemScore) {
            // This is a facet
            if (category === "all") {
              // Using the original method, count each facet as two
              itemScore = 2 * ItemScores["Rainbow Facet"];
            } else {
              // using the new split facet system, count each as one
              itemScore = ItemScores["Rainbow Facet"];
            }
          }
          missing.score += itemScore;
          missing.itemScores.push(itemScore);
        }
      } else {
        ItemScoreCalculator.sumMissing(() => possibleItem, missing, key);
      }
    });
    return missing;
  };

  public static isItem(data: any): boolean {
    const itemProto = new Item();
    return (
      data &&
      typeof data === "object" &&
      (!Object.keys(data).length ||
        Object.keys(itemProto).some(k => data.hasOwnProperty(k)))
    );
  }
}
