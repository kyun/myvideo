type InputMediaDeviceInfos = { [key in MediaDeviceKind]?: Array<MediaDeviceInfo> };

export async function getLocalDevices(): Promise<InputMediaDeviceInfos> {
  const infos = await navigator?.mediaDevices?.enumerateDevices();
  return infos.reduce<InputMediaDeviceInfos>((prevInfos, currentInfo) => {
    switch (currentInfo.kind) {
      case 'audioinput':
      case 'videoinput': {
        const prevInfoList = prevInfos[currentInfo.kind] || [];
        return {
          ...prevInfos,
          [currentInfo.kind]: [...prevInfoList, currentInfo],
        };
      }
      default:
    }
    return prevInfos;
  }, {});
}

export async function getLocalMediaStream(
  {
    audioinput,
    videoinput,
  }: {
    audioinput: number;
    videoinput: number;
  },
  cameraOn: boolean,
): Promise<MediaStream | null> {
  try {
    const mediaDevices = await getLocalDevices();
    if (!mediaDevices) throw new Error('no media device');

    const constraint = cameraOn
      ? {
          audio: {
            deviceId: mediaDevices?.audioinput?.[audioinput].deviceId,
          },
          video: {
            height: { ideal: 640 },
            width: { ideal: 1440 },
            deviceId: mediaDevices?.videoinput?.[videoinput].deviceId,
          },
        }
      : {
          audio: {
            deviceId: mediaDevices?.audioinput?.[audioinput].deviceId,
          },
        };
    const stream = await navigator.mediaDevices.getUserMedia(constraint);
    return stream;
  } catch (e) {
    //
    console.log(e);
    return null;
  }
}