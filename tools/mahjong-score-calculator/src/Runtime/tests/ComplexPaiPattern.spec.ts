import "../../Utilities/Utilities";
import { describe, expect, test } from "vitest";
import { Mahjong } from "../Mahjong";

describe("ComplexPaiPattern", () => {
  test("Interleaved format 1 (normally)", () => {
    const score = new Mahjong([
      "2m",
      "3m",
      "4m",
      "3m",
      "4m",
      "5m",
      "4m",
      "5m",
      "6m",
      "5m",
      "6m",
      "7m",
      "8s",
      "8s",
    ]).score.fourPlayerStyleScore;

    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(30);
  });

  test("Interleaved format 2 (include koutsu)", () => {
    const score = new Mahjong([
      "2m",
      "3m",
      "4m",
      "3m",
      "4m",
      "5m",
      "3s",
      "3s",
      "3s",
      "2p",
      "3p",
      "4p",
      "8s",
      "8s",
    ]).score.fourPlayerStyleScore;

    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(30);
  });

  test("Interleaved format 3 (include kan)", () => {
    const score = new Mahjong([
      "2m",
      "3m",
      "4m",
      "3m",
      "4m",
      "5m",
      "3p",
      "3p",
      "3p",
      "2p",
      "3p",
      "4p",
      "8s",
      "8s",
    ]).score.fourPlayerStyleScore;

    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(30);
  });
});
