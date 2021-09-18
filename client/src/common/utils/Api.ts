import { Observable, Subscriber } from "rxjs";
import { IHolyGrailData } from "../definitions/union/IHolyGrailData";
import { IEthGrailData } from "../definitions/union/IEthGrailData";
import { IRunewordGrailApiData } from "../definitions/api/IRunewordGrailApiData";
import { IHolyGrailApiModel } from "../definitions/api/IHolyGrailApiModel";
import { IPartyApiModel } from "../definitions/api/IPartyApiModel";
import { IGrailSettings } from "../definitions/union/IGrailSettings";
import { IItemInfo } from "../definitions/api/IItemInfo";
import { IRunewordInfo } from "../definitions/api/IRunewordInfo";
import { IGrailStatistics } from "../definitions/api/IGrailStatistics";
import { IRuneInfo } from "../definitions/api/IRuneInfo";

export interface IApiResponse<T> {
  status: number;
  data: T;
}

export class Api {
  private static readonly apiUrl = "/api/";
  private static readonly grailApiUrl = Api.apiUrl + "grail/";
  private static readonly partyApiUrl = Api.apiUrl + "party/";

  public static getStatistics(): Observable<IApiResponse<IGrailStatistics>> {
    return this.fetchToObservable(fetch(`${Api.apiUrl}stats`));
  }

  public static getItem(itemName: string): Observable<IApiResponse<IItemInfo>> {
    return this.fetchToObservable(fetch(`${Api.apiUrl}items/${itemName}`));
  }

  public static getRuneword(
    runewordName: string
  ): Observable<IApiResponse<IRunewordInfo>> {
    return this.fetchToObservable(
      fetch(`${Api.apiUrl}runewords/${runewordName}`)
    );
  }

  public static getRune(
    runeName: string
  ): Observable<IApiResponse<IRuneInfo>> {
    return this.fetchToObservable(
      fetch(`${Api.apiUrl}runes/${runeName}`)
    );
  }

  public static getGrail(
    address: string,
    partyView?: boolean
  ): Observable<IApiResponse<IHolyGrailApiModel>> {
    let url = Api.grailApiUrl + address;
    if (partyView) {
      url += "?partyView=true";
    }
    return this.fetchToObservable(fetch(url));
  }

  public static updateGrail(
    address: string,
    password: string,
    token: string,
    version: string,
    grail: IHolyGrailData,
    ethGrail: IEthGrailData,
    runewordGrail: IRunewordGrailApiData
  ): Observable<IApiResponse<IHolyGrailApiModel>> {
    return this.fetchToObservable(
      fetch(Api.grailApiUrl + address, {
        method: "put",
        body: JSON.stringify({
          version,
          grail,
          ethGrail,
          runewordGrail,
          password,
          token
        }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }
  public static updateSettings(
    address: string,
    password: string,
    token: string,
    settings: IGrailSettings
  ): Observable<IApiResponse<IHolyGrailApiModel>> {
    return this.fetchToObservable(
      fetch(`${Api.grailApiUrl}${address}/settings`, {
        method: "put",
        body: JSON.stringify({ settings, password, token }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }

  public static createGrail(
    address: string,
    password: string,
    versionOrTemplate: string | IHolyGrailApiModel
  ): Observable<IApiResponse<IHolyGrailApiModel>> {
    const isVersion = typeof versionOrTemplate === "string";
    return this.fetchToObservable(
      fetch(Api.grailApiUrl, {
        method: "post",
        body: JSON.stringify({
          address,
          password,
          version: isVersion ? versionOrTemplate : undefined,
          template: !isVersion ? versionOrTemplate : undefined
        }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }

  public static validatePassword(
    address: string,
    password: string
  ): Observable<IApiResponse<boolean>> {
    return this.fetchToObservable(
      fetch(`${Api.grailApiUrl}${address}/password/validate`, {
        method: "put",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }

  private static fetchToObservable = <T>(
    fetchPromise: Promise<Response>
  ): Observable<IApiResponse<T>> => {
    return Observable.create(async (observer: Subscriber<IApiResponse<T>>) => {
      try {
        const response = await fetchPromise;
        if (!response) {
          observer.error({ status: 500, data: undefined });
          return;
        }

        const json = await response.json();
        if (response.status < 400) {
          observer.next({ status: response.status, data: json });
          observer.complete();
        } else {
          observer.error({ status: response.status, data: json });
        }
      } catch (err) {
        observer.error({ status: 500, data: err });
      }
    });
  };

  // Party methods
  public static getParty(
    address: string
  ): Observable<IApiResponse<IPartyApiModel>> {
    return this.fetchToObservable(fetch(Api.partyApiUrl + address));
  }

  public static createParty(
    address: string,
    password: string
  ): Observable<IApiResponse<IPartyApiModel>> {
    return this.fetchToObservable(
      fetch(Api.partyApiUrl, {
        method: "post",
        body: JSON.stringify({ address, password }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }

  public static modifyPartyUser(
    address: string,
    password: string,
    token: string,
    user: string,
    method: string
  ): Observable<IApiResponse<IPartyApiModel>> {
    return this.fetchToObservable(
      fetch(`${Api.partyApiUrl}${address}/manage/${method}`, {
        method: "put",
        body: JSON.stringify({
          address,
          password,
          token,
          user,
          method
        }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }

  public static validatePartyPassword(
    address: string,
    password: string
  ): Observable<IApiResponse<boolean>> {
    return this.fetchToObservable(
      fetch(`${Api.partyApiUrl}${address}/password/validate`, {
        method: "put",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" }
      })
    );
  }
}
