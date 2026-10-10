/**
 * Phase 10: VoiSpace room-creation validation tests.
 *
 * Covers Pilot's bugs #1 (Next permanently disabled) and #3 (dead form when
 * no audio devices): the extracted pure validation logic.
 */
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";
import {
  isDeviceStepValid,
  isNextEnabled,
} from "@/components/voispace/host/voispace.create.channel.modal/room-validation";

describe("isNextEnabled (Bug #1: title gates Next, image is optional)", () => {
  test("valid title enables Next (no image required)", () => {
    expect(isNextEnabled("My Room", true)).toBe(true);
  });

  test("blank title disables Next", () => {
    expect(isNextEnabled("", true)).toBe(false);
    expect(isNextEnabled("   ", true)).toBe(false);
    expect(isNextEnabled(null, true)).toBe(false);
    expect(isNextEnabled(undefined, true)).toBe(false);
  });

  test("invalid permissions disable Next even with a title", () => {
    expect(isNextEnabled("My Room", false)).toBe(false);
  });
});

describe("isDeviceStepValid (Bug #3: no devices must not dead-end the form)", () => {
  const base = {
    type: BroadcastTypeEnum.AMA as BroadcastTypeEnum,
    hasAudioDevice: false,
    hasVideoDevice: false,
    audioUnavailable: false,
    videoUnavailable: false,
    microphoneCount: 1,
    cameraCount: 1,
  };

  test("AMA with a selected microphone is valid", () => {
    expect(
      isDeviceStepValid({ ...base, hasAudioDevice: true })
    ).toBe(true);
  });

  test("AMA without a microphone (devices exist) is invalid", () => {
    expect(isDeviceStepValid(base)).toBe(false);
  });

  test("AMA with NO microphones at all is valid (graceful, not dead)", () => {
    expect(
      isDeviceStepValid({
        ...base,
        audioUnavailable: true,
        microphoneCount: 0,
      })
    ).toBe(true);
  });

  test("LIVE requires both devices when they exist", () => {
    const live = { ...base, type: BroadcastTypeEnum.LIVE as BroadcastTypeEnum };
    expect(
      isDeviceStepValid({ ...live, hasAudioDevice: true, hasVideoDevice: true })
    ).toBe(true);
    expect(
      isDeviceStepValid({ ...live, hasAudioDevice: true })
    ).toBe(false);
    expect(
      isDeviceStepValid({ ...live, hasVideoDevice: true })
    ).toBe(false);
  });

  test("LIVE with no devices at all is valid (graceful, not dead)", () => {
    expect(
      isDeviceStepValid({
        ...base,
        type: BroadcastTypeEnum.LIVE as BroadcastTypeEnum,
        audioUnavailable: true,
        videoUnavailable: true,
        microphoneCount: 0,
        cameraCount: 0,
      })
    ).toBe(true);
  });
});
