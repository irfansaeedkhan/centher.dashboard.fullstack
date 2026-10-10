/**
 * Phase 10: VoiSpace room-creation validation logic (extracted for testability).
 *
 * Bug #1 (Pilot 2026-10-10): the Next button was permanently disabled because
 * it required BOTH a title AND an uploaded image. The image is now optional —
 * only a non-blank title gates progress.
 *
 * Bug #3 (Pilot 2026-10-10): when the browser reports no audio/video devices,
 * the form was dead (device selection could never succeed). Now an empty
 * device list doesn't block — the room is created and the user joins without
 * that device.
 */
import { BroadcastTypeEnum } from "@/stream/enum/stream-type.enum";

export interface DeviceValidityInput {
  type: BroadcastTypeEnum;
  hasAudioDevice: boolean;
  hasVideoDevice: boolean;
  audioUnavailable: boolean;
  videoUnavailable: boolean;
  microphoneCount: number;
  cameraCount: number;
}

/** Whether the device step is valid (feeds the Next button). */
export function isDeviceStepValid(input: DeviceValidityInput): boolean {
  const audioOk =
    input.hasAudioDevice ||
    (input.audioUnavailable && input.microphoneCount === 0);
  const videoOk =
    input.type === BroadcastTypeEnum.AMA ||
    input.hasVideoDevice ||
    (input.videoUnavailable && input.cameraCount === 0);
  return audioOk && videoOk;
}

/** Whether the Next button should be enabled on the details step. */
export function isNextEnabled(
  title: string | undefined | null,
  permissionsValid: boolean,
): boolean {
  return !!title?.trim() && permissionsValid;
}
