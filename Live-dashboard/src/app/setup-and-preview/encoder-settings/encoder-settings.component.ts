import { Component, OnInit } from '@angular/core';
import { LiveEntryService } from '../../services/live-entry.service';
import { Message } from 'primeng/primeng';


declare type EncoderUrls = {
  primary: string;
  secondary: string;
}

@Component({
  selector: 'encoder-settings',
  templateUrl: 'encoder-settings.component.html',
  styleUrls: ['encoder-settings.component.scss']
})
export class EncoderSettingsComponent implements OnInit {
  public _rtmpUrls: EncoderUrls = { primary: "", secondary: "" };
  public _rtspUrls: EncoderUrls = { primary: "", secondary: "" };
  public _streamName: string = "";
  public _copyToClipBoardEnabled: boolean = false;
  public _msgs: Message[] = [];

  constructor(private _liveEntryService: LiveEntryService) { }

  ngOnInit() {
    this._liveEntryService.liveStream$.subscribe(response => {
      if (response) {
        this._rtmpUrls.primary = response.primaryBroadcastingUrl;
        this._rtmpUrls.secondary = response.secondaryBroadcastingUrl;
        this._rtspUrls.primary = response.primaryRtspBroadcastingUrl;
        this._rtspUrls.secondary = response.secondaryRtspBroadcastingUrl;
        this._streamName = response.streamName;
      }
    });
    this._copyToClipBoardEnabled = this._copyToClipboardEnabled();
  }

  // TODO: Should be moved to a proper service?
  private _copyToClipboardEnabled(): boolean {
    let enabled = true;
    // detect Safari version lower than 10
    let isChrome = !!window['chrome'] && !!window['chrome'].webstore;
    let isSafari = Object.prototype.toString.call(window['HTMLElement']).indexOf('Constructor') > 0 || !isChrome && window['webkitAudioContext'] !== undefined;
    if (isSafari) {
      let nAgt = navigator.userAgent;
      let verOffset = nAgt.indexOf("Version");
      let fullVersion = nAgt.substring(verOffset + 8);
      let ix;
      if ((ix = fullVersion.indexOf(";")) != -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      if ((ix = fullVersion.indexOf(" ")) != -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      let majorVersion = parseInt('' + fullVersion, 10);
      enabled = majorVersion < 10;
    }
    return enabled;
  }

  private _copyToClipboardAction(text: string): boolean {
    let copied = false;
    let textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = -1000 + 'px';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      copied = document.execCommand('copy');
    } catch (err) {
      console.log('Copy to clipboard operation failed');
    }
    document.body.removeChild(textArea);
    return copied;
  }

  public _copyToClipboard(text: string): void {
    let copied: boolean = this._copyToClipboardAction(text);
    this._msgs = [];
    if (copied) {
      this._msgs.push({ severity: 'success', summary: '', detail: 'Copied to clipboard' });
    }
    else {
      this._msgs.push({ severity: 'error', summary: '', detail: 'Copy operation failed' });
    }
  }
}
