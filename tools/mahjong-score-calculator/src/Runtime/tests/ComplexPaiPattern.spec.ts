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
    ]).calculator.value;

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
    ]).calculator.value;

    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(30);
  });

  test("Interleaved format 3 (no kan fulfilled)", () => {
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
    ]).calculator.value;

    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(30);
  });

  test("Interleaved format 4 (include fulfilling kan and rinshan pai)", () => {
    const score = new Mahjong([
      "2m",
      "3m",
      "4m",
      "3m",
      "4m",
      "5m",
      "3pk",
      "3pk",
      "3pk",
      "4p",
      "4p",
      "3pk",
      "4p",
      "8s",
      "8s",
    ]).calculator.value;

    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(40);
  });

  test("Use 4 pai but fulfilled normally yaku (SanShoku DouJun)", () => {
    const score = new Mahjong([
      "1m",
      "2m",
      "3m",

      "1p",
      "2p",
      "3p",

      "1s",
      "2s",
      "3s",

      "3s",
      "3s",
      "3s",

      "4s",
      "4s",
    ]).calculator.value;

    expect(score?.yaku).eq(2);
    expect(score?.fu).eq(30);
  });

  test("Legal Kan", () => {
    const score = new Mahjong([
      "1mk",
      "1mk",
      "1mk",
      "1mk",

      "2mk",
      "2mk",
      "2mk",
      "2mk",

      "1s",
      "2s",
      "3s",

      "1s",
      "2s",
      "3s",

      "4s",
      "4s",
    ]).calculator.value;

    // NOTE: Here is IpeiKou
    expect(score?.yaku).eq(1);
    expect(score?.fu).eq(70);
  });

  test("Illegal Kan (needs rinshanpai 2 but using 1 only)", () => {
    const score = () =>
      new Mahjong([
        "1mk",
        "1mk",
        "1mk",
        "1mk",

        "2mk",
        "2mk",
        "2mk",
        "2mk",

        "1s",
        "2s",
        "3s",

        "1s",
        "1s",

        "4s",
        "4s",
      ]).calculator.value;

    expect(score).toThrow(
      "The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on",
    );
  });

  test("Illegal Kan (needs rinshanpai 2 but using 4 only)", () => {
    const score = () =>
      new Mahjong([
        "1mk",
        "1mk",
        "1mk",
        "1mk",

        "2mk",
        "2mk",
        "2mk",
        "2mk",

        "1s",
        "2s",
        "3s",

        "1s",
        "2s",
        "3s",

        "1s",
        "2s",
        "3s",

        "4s",
        "4s",
      ]).calculator.value;

    expect(score).toThrow(
      "The mahjong scores are not available that reason for Yaku are not fulfilled, invalid format and so on",
    );
  });
});
