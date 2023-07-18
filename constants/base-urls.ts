let _CISBaseUrl = `https://${process.env.NEXT_PUBLIC_CIS_HOST}`;
let _CFSBaseUrl = `https://${process.env.NEXT_PUBLIC_CFS_HOST}`;

if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
  _CISBaseUrl = `http://${process.env.NEXT_PUBLIC_CIS_HOST}`;
  _CFSBaseUrl = `http://${process.env.NEXT_PUBLIC_CFS_HOST}`;
}

export const CISBaseURL = _CISBaseUrl;
export const CFSBaseURL = _CFSBaseUrl;
