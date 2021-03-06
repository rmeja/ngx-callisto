import { __awaiter, __generator } from 'tslib';
import { Component, Input, Injectable, NgModule, Directive, Renderer2, ElementRef, HostListener, Pipe, ViewChild, EventEmitter, Output, ViewChildren, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reduce, isEqual, map } from 'lodash';
import * as erdImported from 'element-resize-detector';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { v4 } from 'uuid';
import { Subject as Subject$1 } from 'rxjs';
import { each, filter } from 'bluebird';

var DefiBoxComponent = /** @class */ (function () {
    function DefiBoxComponent() {
    }
    return DefiBoxComponent;
}());
DefiBoxComponent.decorators = [
    { type: Component, args: [{
                selector: "defi-box",
                template: "<div id=\"box\">\n    <div id=\"box-title\">\n        {{title}}\n    </div>\n    <div class=\"box-container\">\n        <ng-content></ng-content>\n    </div>\n\n</div>",
                styles: [":host{width:100%}:host #box{width:100%}:host #box .box-title{font-size:1.2rem}:host #box .box-container{background-color:#fff;-webkit-box-shadow:1px 1px 9px 0 grey;box-shadow:1px 1px 9px 0 grey}"]
            },] },
];
DefiBoxComponent.propDecorators = {
    "title": [{ type: Input },],
};
var DefiSidePanelService = /** @class */ (function () {
    function DefiSidePanelService() {
        this._open = false;
    }
    DefiSidePanelService.prototype.open = function (template, context) {
        if (template)
            this.template = template;
        if (context)
            this.context = context;
        this._open = true;
    };
    DefiSidePanelService.prototype.close = function () {
        this._open = false;
    };
    DefiSidePanelService.prototype.toggle = function () {
        this._open = !this._open;
    };
    return DefiSidePanelService;
}());
DefiSidePanelService.decorators = [
    { type: Injectable },
];
var DefiSidePanelComponent = /** @class */ (function () {
    function DefiSidePanelComponent(sidepanel) {
        this.sidepanel = sidepanel;
    }
    return DefiSidePanelComponent;
}());
DefiSidePanelComponent.decorators = [
    { type: Component, args: [{
                selector: "defi-side-panel",
                template: "<div id=\"sidePanelClose\" [ngClass]=\"{'openSidePanel':sidepanel._open, 'closeSidePanel':!sidepanel._open}\" (click)=\"sidepanel._open=false\">\n    <i class='fa fa-chevron-right'></i>\n    <div id=\"sidePanelContainer\" click-stop-propagation>\n        <ng-container *ngTemplateOutlet=\"sidepanel.template; context: sidepanel.context\"></ng-container>\n    </div>\n</div>\n ",
                styles: [".formGroup{margin-bottom:10px}.formGroup label{width:100%}@-webkit-keyframes openSidePanel{0%{max-width:0;padding-left:0}100%{padding-left:10%;max-width:100vw}}@keyframes openSidePanel{0%{max-width:0;padding-left:0}100%{padding-left:10%;max-width:100vw}}@-webkit-keyframes closeSidePanel{0%{padding-left:10%;max-width:100vw}100%{padding-left:0;max-width:0}}@keyframes closeSidePanel{0%{padding-left:10%;max-width:100vw}100%{padding-left:0;max-width:0}}:host{height:100%}:host #sidePanelClose{position:absolute;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-ms-flex-pack:end;justify-content:flex-end;right:0;width:100vw;height:100%;background-color:rgba(0,0,0,.7);max-width:0;overflow-x:hidden}:host #sidePanelClose i{color:#fff;height:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;background-color:#343a40;padding-left:10px;padding-right:10px}:host #sidePanelClose ::ng-deep #sideHeader{background-color:#343a40;color:#fff;text-align:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:10px}:host #sidePanelClose ::ng-deep #sideContainer{padding:20px}:host #sidePanelClose #sidePanelContainer{background-color:#fff;height:100%}:host #sidePanelClose.closeSidePanel{-webkit-animation-name:closeSidePanel;animation-name:closeSidePanel;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}:host #sidePanelClose.openSidePanel{-webkit-animation-name:openSidePanel;animation-name:openSidePanel;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}"]
            },] },
];
DefiSidePanelComponent.ctorParameters = function () { return [
    { type: DefiSidePanelService, },
]; };
var DefiContainersModule = /** @class */ (function () {
    function DefiContainersModule() {
    }
    DefiContainersModule.forRoot = function () {
        return {
            ngModule: DefiContainersModule,
            providers: [
                DefiSidePanelService,
            ]
        };
    };
    return DefiContainersModule;
}());
DefiContainersModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    DefiSidePanelComponent,
                    DefiBoxComponent
                ],
                exports: [
                    DefiSidePanelComponent,
                    DefiBoxComponent
                ]
            },] },
];
var DefiCommonService = /** @class */ (function () {
    function DefiCommonService() {
        this.api = 'http://localhost:3000';
        this.graphQL = this.api + '/graphql';
        this.refreshTokenInterval = 4000;
    }
    DefiCommonService.prototype.equalityObjects = function (a, b) {
        var differences = this.differences(a, b);
        var d = differences.different.length + differences.missing_from_first.length + differences.missing_from_second.length;
        return d === 0 ? true : false;
    };
    DefiCommonService.prototype.differences = function (a, b) {
        var _this = this;
        var result = {
            different: [],
            missing_from_first: [],
            missing_from_second: []
        };
        reduce(a, function (result, value, key) {
            if (b.hasOwnProperty(key)) {
                if (isEqual(value, b[key])) {
                    return result;
                }
                else {
                    if (typeof (a[key]) !== typeof ({}) || typeof (b[key]) !== typeof ({})) {
                        result.different.push(key);
                        return result;
                    }
                    else {
                        var deeper = _this.differences(a[key], b[key]);
                        result.different = result.different.concat(map(deeper.different, function (sub_path) { return key + '.' + sub_path; }));
                        result.missing_from_second = result.missing_from_second.concat(map(deeper.missing_from_second, function (sub_path) { return key + '.' + sub_path; }));
                        result.missing_from_first = result.missing_from_first.concat(map(deeper.missing_from_first, function (sub_path) { return key + '.' + sub_path; }));
                        return result;
                    }
                }
            }
            else {
                result.missing_from_second.push(key);
                return result;
            }
        }, result);
        reduce(b, function (result, value, key) {
            if (a.hasOwnProperty(key)) {
                return result;
            }
            else {
                result.missing_from_first.push(key);
                return result;
            }
        }, result);
        return result;
    };
    DefiCommonService.prototype.wait = function (ms) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, ms);
        });
    };
    DefiCommonService.prototype.flatten = function (obj) {
        var newObj = {};
        function flat(obj) {
            Object.keys(obj).map(function (key) {
                if (typeof obj[key] === 'object') {
                    flat(obj[key]);
                }
                else {
                    newObj[key] = obj[key];
                }
            });
        }
        flat(obj);
        return newObj;
    };
    DefiCommonService.prototype.stringifyWithoutPropertiesQuote = function (obj) {
        return JSON.stringify(obj)
            .replace(/(\{ *"enum" *\: *")([a-z A-Z 0-9]*)" *}/gm, '$2')
            .replace(/\\"/g, '\uFFFF')
            .replace(/\"([^"]+)\":/g, '$1:')
            .replace(/\uFFFF/g, '\\"');
    };
    DefiCommonService.prototype.filter = function () {
        var filterFun = function (value) { return value; };
        return {
            filter: function (_) { return filterFun; },
            update: function (search, propertiesToSearch) {
                filterFun = function (accounts) {
                    var tmpAccounts = [];
                    propertiesToSearch.map(function (propertyToSearch) {
                        accounts.forEach(function (account) {
                            var accountValue = recursiveCheck(account, propertyToSearch.split('.'));
                            if (accountValue && accountValue.toUpperCase().includes(search.toUpperCase())) {
                                tmpAccounts.push(account);
                            }
                        });
                    });
                    return tmpAccounts.reduce(function (a, b) {
                        if (a.indexOf(b) < 0)
                            a.push(b);
                        return a;
                    }, []);
                };
            }
        };
        function recursiveCheck(obj, props) {
            if (props.length)
                return recursiveCheck(obj[props[0]], props.slice(1, props.length));
            return obj;
        }
    };
    return DefiCommonService;
}());
DefiCommonService.decorators = [
    { type: Injectable },
];
DefiCommonService.ctorParameters = function () { return []; };
var DefiSpinningIconDirective = /** @class */ (function () {
    function DefiSpinningIconDirective(renderer, hostElement) {
        this.renderer = renderer;
        this.hostElement = hostElement;
    }
    DefiSpinningIconDirective.prototype.start = function (event) {
        this.renderer.addClass(this.hostElement.nativeElement, 'spin-animation');
        this.renderer.addClass(this.hostElement.nativeElement, 'fa-spinner');
    };
    DefiSpinningIconDirective.prototype.stop = function () {
        this.renderer.removeClass(this.hostElement.nativeElement, 'spin-animation');
        this.renderer.removeClass(this.hostElement.nativeElement, 'fa-spinner');
    };
    return DefiSpinningIconDirective;
}());
DefiSpinningIconDirective.decorators = [
    { type: Directive, args: [{
                selector: "[defi-spinning-icon]",
                exportAs: 'spinning'
            },] },
];
DefiSpinningIconDirective.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
var DefiClickStopPropagation = /** @class */ (function () {
    function DefiClickStopPropagation() {
    }
    DefiClickStopPropagation.prototype.onClick = function (event) {
        event.stopPropagation();
    };
    return DefiClickStopPropagation;
}());
DefiClickStopPropagation.decorators = [
    { type: Directive, args: [{
                selector: '[defi-click-stop-propagation]'
            },] },
];
DefiClickStopPropagation.propDecorators = {
    "onClick": [{ type: HostListener, args: ['click', ['$event'],] },],
};
var DefiToId = /** @class */ (function () {
    function DefiToId() {
    }
    DefiToId.prototype.transform = function (value) {
        return value.split(' ').join('').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    };
    return DefiToId;
}());
DefiToId.decorators = [
    { type: Pipe, args: [{ name: 'defi-toId', pure: true },] },
];
var erd = erdImported;
var DefiPopoverComponent = /** @class */ (function () {
    function DefiPopoverComponent(renderer) {
        this.renderer = renderer;
        this.open = false;
        this.placement = 'right';
        this.positionClass = 'popover-right';
        this.resizeDetector = erd({
            strategy: 'scroll'
        });
    }
    DefiPopoverComponent.prototype.loadState = function (open) {
        open ?
            this.renderer.setStyle(this.popupContainer.nativeElement, 'visibility', 'visible') :
            this.renderer.setStyle(this.popupContainer.nativeElement, 'visibility', 'hidden');
    };
    DefiPopoverComponent.prototype.ngOnChanges = function (changes) {
        this.loadState(changes['open'].currentValue);
    };
    DefiPopoverComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.resizeDetector.listenTo(this.popupContainer.nativeElement, function (element) {
            var width = element.offsetWidth;
            var height = element.offsetHeight;
            if (_this.placement === 'top' || _this.placement === 'bottom') {
                _this.renderer.setStyle(_this.popupContainer.nativeElement, 'left', '-' + width / 2 + 'px');
            }
        });
    };
    return DefiPopoverComponent;
}());
DefiPopoverComponent.decorators = [
    { type: Component, args: [{
                selector: 'defi-popover',
                template: "<div class=\"defi-popover\">\n    <div class=\"defi-popover-container {{placement}}\" #popupContainer>\n        <ng-content select=\"[popover=content]\"></ng-content>\n    </div>\n    <ng-content></ng-content>\n</div>",
                styles: [".formGroup{margin-bottom:10px}.formGroup label{width:100%}:host .defi-popover{position:relative;width:100%}:host .defi-popover .defi-popover-container{padding:10px;-webkit-transition-property:all;transition-property:all;-webkit-transition-duration:.1s;transition-duration:.1s;-webkit-transition-timing-function:cubic-bezier(.075,.82,.165,1);transition-timing-function:cubic-bezier(.075,.82,.165,1);visibility:hidden;border:1px solid #d2d2d2;position:absolute;z-index:1;background-color:#fff;border-radius:3px}:host .defi-popover .defi-popover-container::after{content:\"\";position:absolute;border-style:solid;border-width:5px}:host .defi-popover .defi-popover-container.right{left:calc(100% + 10px)}:host .defi-popover .defi-popover-container.right::after{right:100%;top:50%;margin-top:-10px;border-color:transparent #b9b9b9 transparent transparent}:host .defi-popover .defi-popover-container.left{right:calc(100% + 10px)}:host .defi-popover .defi-popover-container.left::after{left:100%;top:50%;margin-top:-10px;border-color:transparent transparent transparent #b9b9b9}:host .defi-popover .defi-popover-container.bottom{top:calc(100% + 10px);left:-101.5px;margin-left:50%}:host .defi-popover .defi-popover-container.bottom::after{left:50%;margin-left:-5px;bottom:100%;border-color:transparent transparent #b9b9b9}:host .defi-popover .defi-popover-container.top{bottom:calc(100% + 10px);left:-101.5px;margin-left:50%}:host .defi-popover .defi-popover-container.top::after{left:50%;margin-left:-5px;top:100%;border-color:#b9b9b9 transparent transparent}:host ::ng-deep ul{list-style:none;margin:0;padding:0}"]
            },] },
];
DefiPopoverComponent.ctorParameters = function () { return [
    { type: Renderer2, },
]; };
DefiPopoverComponent.propDecorators = {
    "open": [{ type: Input, args: ['open',] },],
    "placement": [{ type: Input, args: ['placement',] },],
    "popupContainer": [{ type: ViewChild, args: ['popupContainer',] },],
};
var DefiCoreModule = /** @class */ (function () {
    function DefiCoreModule() {
    }
    DefiCoreModule.forRoot = function () {
        return {
            ngModule: DefiCoreModule,
            providers: [
                DefiCommonService,
            ]
        };
    };
    return DefiCoreModule;
}());
DefiCoreModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    DefiClickStopPropagation,
                    DefiSpinningIconDirective,
                    DefiToId,
                    DefiPopoverComponent,
                ],
                imports: [
                    CommonModule,
                ],
                exports: [
                    DefiSpinningIconDirective,
                    DefiToId,
                    DefiPopoverComponent,
                    DefiClickStopPropagation
                ]
            },] },
];
var DefiDebounceInputDirective = /** @class */ (function () {
    function DefiDebounceInputDirective() {
        this.debounceTime = 500;
        this.debounce = new EventEmitter();
        this.subject = new Subject();
    }
    DefiDebounceInputDirective.prototype.ngOnInit = function () {
        this.createSubsription();
    };
    DefiDebounceInputDirective.prototype.createSubsription = function () {
        var _this = this;
        this.subscription = this.subject.pipe(debounceTime(this.debounceTime)).subscribe(function (e) { return _this.debounce.emit(e); });
    };
    DefiDebounceInputDirective.prototype.ngOnChanges = function (changes) {
        if (changes["debounceTime"] && this.subject.observers[0])
            this.subject.observers[0]['dueTime'] = changes["debounceTime"].currentValue;
    };
    DefiDebounceInputDirective.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    DefiDebounceInputDirective.prototype.keyupEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.subject.next(event);
    };
    return DefiDebounceInputDirective;
}());
DefiDebounceInputDirective.decorators = [
    { type: Directive, args: [{
                selector: '[defi-debounce-input]'
            },] },
];
DefiDebounceInputDirective.propDecorators = {
    "debounceTime": [{ type: Input },],
    "debounce": [{ type: Output },],
    "keyupEvent": [{ type: HostListener, args: ['keyup', ['$event'],] },],
};
var DefiShowPasswordDirective = /** @class */ (function () {
    function DefiShowPasswordDirective(renderer, hostElement) {
        this.renderer = renderer;
        this.hostElement = hostElement;
    }
    DefiShowPasswordDirective.prototype.ngOnInit = function () {
        var _this = this;
        var container = this.renderer.createElement('div');
        this.renderer.setStyle(container, 'position', 'relative');
        var div = this.renderer.createElement('i');
        this.renderer.addClass(div, 'fa');
        this.renderer.addClass(div, 'fa-eye-slash');
        this.renderer.addClass(div, 'toggle-eye');
        this.renderer.setStyle(div, 'position', 'absolute');
        this.renderer.setStyle(div, 'top', 0);
        this.renderer.setStyle(div, 'right', 0);
        this.renderer.setStyle(div, 'display', 'inherit');
        this.renderer.setStyle(div, 'cursor', 'pointer');
        this.renderer.listen(div, 'click', function (event) {
            var input = _this.hostElement.nativeElement;
            if (input.type === 'password') {
                input.type = 'text';
                _this.renderer.addClass(div, 'fa-eye');
                _this.renderer.removeClass(div, 'fa-eye-slash');
            }
            else {
                input.type = 'password';
                _this.renderer.removeClass(div, 'fa-eye');
                _this.renderer.addClass(div, 'fa-eye-slash');
            }
        });
        var parent = this.hostElement.nativeElement.parentNode;
        this.renderer.insertBefore(parent, container, this.renderer.nextSibling(this.hostElement.nativeElement));
        this.renderer.appendChild(container, this.hostElement.nativeElement);
        this.renderer.appendChild(container, div);
    };
    return DefiShowPasswordDirective;
}());
DefiShowPasswordDirective.decorators = [
    { type: Directive, args: [{
                selector: '[defi-show-password]',
            },] },
];
DefiShowPasswordDirective.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
var DefiValidatorsDirective = /** @class */ (function () {
    function DefiValidatorsDirective(renderer, hostElement) {
        this.renderer = renderer;
        this.hostElement = hostElement;
    }
    DefiValidatorsDirective.prototype.ngAfterViewChecked = function () {
        this.onInputChange();
    };
    DefiValidatorsDirective.prototype.onInputChange = function () {
        if (this.hostElement.nativeElement.disabled) {
            this.renderer.removeClass(this.hostElement.nativeElement, 'badInput');
            this.renderer.removeClass(this.hostElement.nativeElement, 'goodInput');
            return;
        }
        if (this.validators.valid) {
            this.renderer.addClass(this.hostElement.nativeElement, 'goodInput');
            this.renderer.removeClass(this.hostElement.nativeElement, 'badInput');
        }
        else {
            this.renderer.addClass(this.hostElement.nativeElement, 'badInput');
            this.renderer.removeClass(this.hostElement.nativeElement, 'goodInput');
        }
    };
    return DefiValidatorsDirective;
}());
DefiValidatorsDirective.decorators = [
    { type: Directive, args: [{
                selector: '[defi-validators]',
                host: {
                    '(input)': 'onInputChange($event)'
                }
            },] },
];
DefiValidatorsDirective.ctorParameters = function () { return [
    { type: Renderer2, },
    { type: ElementRef, },
]; };
DefiValidatorsDirective.propDecorators = {
    "validators": [{ type: Input, args: ['defi-validators',] },],
};
var DefiFormErrorsComponent = /** @class */ (function () {
    function DefiFormErrorsComponent() {
    }
    return DefiFormErrorsComponent;
}());
DefiFormErrorsComponent.decorators = [
    { type: Component, args: [{
                selector: "defi-form-errors",
                template: "<!-- {{model.errors | json}} -->\n\n<ul *ngIf=\"model && model.errors\">\n    <li *ngIf=\"model.errors.pattern\" class=\"hint\">\n         <ng-container *ngIf=\"patternName; else notPatternName\">\n            {{patternName}}\n        </ng-container>\n        <ng-template #notPatternName>\n            Pattern: {{model.errors.pattern.requiredPattern}}\n        </ng-template>\n    </li>\n    <li *ngIf=\"model.errors.required\" class=\"hint\">\n        Obligatoire\n    </li>\n    <li *ngIf=\"model.errors.minlength\" class=\"hint\">\n        Contient au moins {{model.errors.minlength.requiredLength}} caract\u00E8res\n    </li>\n    <li *ngIf=\"model.errors.maxlength\" class=\"hint\">\n        Contient au plus {{model.errors.maxlength.requiredLength}} caract\u00E8res\n    </li>\n    <li *ngIf=\"model.errors.recheckPassphrase\" class=\"hint\">\n        Doit correspondre \u00E0 la phrase de passe\n    </li>\n    <li *ngIf=\"model.errors.email\" class=\"hint\">\n        Doit \u00EAtre un email\n    </li>\n</ul>\n",
                styles: [".formGroup{margin-bottom:10px}.formGroup label{width:100%}:host{display:inline-block;font-size:.7em;width:100%;min-height:.7em;top:-2px;line-height:0;text-align:right;color:#dc3545}"]
            },] },
];
DefiFormErrorsComponent.propDecorators = {
    "model": [{ type: Input, args: ['model',] },],
    "patternName": [{ type: Input, args: ['patternName',] },],
};
var DefiFormsModule = /** @class */ (function () {
    function DefiFormsModule() {
    }
    return DefiFormsModule;
}());
DefiFormsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    DefiFormErrorsComponent,
                    DefiDebounceInputDirective,
                    DefiValidatorsDirective,
                    DefiShowPasswordDirective,
                ],
                exports: [
                    DefiFormErrorsComponent,
                    DefiDebounceInputDirective,
                    DefiValidatorsDirective,
                    DefiShowPasswordDirective,
                ]
            },] },
];
var DefiPassword = /** @class */ (function () {
    function DefiPassword() {
    }
    DefiPassword.MatchPassword = function (AC) {
        var confirmPassword = AC.value.passphrase;
        var password = AC.value.recheckPassphrase;
        if (confirmPassword !== password) {
            return { recheckPassphrase: true };
        }
        else
            return null;
    };
    DefiPassword.GeneratePassword = function (length) {
        if (length === void 0) { length = 12; }
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]\:;?><,./-=";
        var retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    };
    return DefiPassword;
}());
var DefiNavbarComponent = /** @class */ (function () {
    function DefiNavbarComponent() {
        this.name = '';
    }
    return DefiNavbarComponent;
}());
DefiNavbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'defi-navbar',
                template: "<div id=\"navbar\" [ngStyle]=\"{'background-image': url ? 'url(img)' : ''}\">\n  <div id=\"leftRight\">\n    <div id=\"left\">\n      <div id=\"logoContainer\">\n        <ng-content select=\"[logo]\"></ng-content>\n      </div>\n      <div id=\"description\">\n        {{name}}\n      </div>\n    </div>\n    <div id=\"right\">\n      <ng-content selector=\"[right]\"></ng-content>\n    </div>\n  </div>\n</div>",
                styles: [".formGroup{margin-bottom:10px}.formGroup label{width:100%}#navbar{height:40px;background-color:#343a40;color:#fff;max-height:40px;background-size:100%}#navbar #leftRight{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%}#navbar #leftRight #left{height:100%;padding-left:5px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}#navbar #leftRight #left #logoContainer{height:80%}#navbar #leftRight #left #logoContainer ::ng-deep [logo]{height:100%;border-radius:100%;overflow:hidden}#navbar #leftRight #left #logoContainer ::ng-deep [logo] img{height:100%}#navbar #leftRight #left #description{margin-left:10px;color:#fff;font-size:1.2em}#navbar #leftRight::ng-deep #right>[right]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:100%;margin-right:10px}#navbar #leftRight::ng-deep #right>[right] .icon{font-size:1.7em}"]
            },] },
];
DefiNavbarComponent.ctorParameters = function () { return []; };
DefiNavbarComponent.propDecorators = {
    "name": [{ type: Input, args: ['name',] },],
    "img": [{ type: Input, args: ['img',] },],
};
var DefiSideBarService = /** @class */ (function () {
    function DefiSideBarService() {
        this._open = false;
    }
    DefiSideBarService.prototype.open = function () {
        this._open = true;
    };
    DefiSideBarService.prototype.close = function () {
        this._open = false;
    };
    DefiSideBarService.prototype.toggle = function () {
        this._open = !this._open;
    };
    return DefiSideBarService;
}());
DefiSideBarService.decorators = [
    { type: Injectable },
];
var DefiSidebarComponent = /** @class */ (function () {
    function DefiSidebarComponent(sidebar) {
        this.sidebar = sidebar;
        this.hintState = 'close';
        this.conf = { list: [], bottom: [] };
    }
    DefiSidebarComponent.prototype.goTo = function (data) {
        data.click();
    };
    DefiSidebarComponent.prototype.newWindow = function (data) {
        if (data.externalUrl) {
            window.open(data.externalUrl);
        }
    };
    DefiSidebarComponent.prototype.toggleSidebar = function () {
        this.sidebar.toggle();
    };
    DefiSidebarComponent.prototype.toggleHint = function ($event) {
        this.hintState =
            $event.type === 'mouseover' && !this.sidebar._open
                ? 'open'
                : 'close';
    };
    return DefiSidebarComponent;
}());
DefiSidebarComponent.decorators = [
    { type: Component, args: [{
                selector: 'defi-sidebar',
                template: "<div class=\"openSidebar\" \n    [ngClass]=\"{'openSidebar':sidebar._open, 'closeSidebar':!sidebar._open}\"\n    [ngStyle]=\"{'background-image': url ? 'url(img)' : ''}\"\n    id=\"sidebar\">\n    <div class=\"list\">\n        <div *ngFor='let item of conf.list'>\n            <ng-container *ngTemplateOutlet=\"linkTemplate;context:{$implicit:item}\"></ng-container>  \n        </div>\n    </div>\n    <div class=\"bottomList\">\n        <div *ngFor='let item of conf.bottom'>\n            <ng-container *ngTemplateOutlet=\"linkTemplate;context:{$implicit:item}\"></ng-container>\n        </div>\n        <div id=\"toggleSidebar\" class=\"item\" (click)=\"toggleSidebar();\" [ngClass]=\"{'openSidebar':sidebar._open, 'closeSidebar':!sidebar._open}\">\n            <div class=\"icon\" >\n                <i class=\"fa fa-arrow-right\"></i>\n            </div>\n        </div>\n    </div>\n</div>\n\n<ng-template #linkTemplate let-item>\n    <div id=\"{{item.id}}\" class=\"item\" (click)=\"goTo(item)\" (auxclick)=\"newWindow(item)\" (mouseover)=\"toggleHint($event)\" (mouseleave)=\"toggleHint($event)\">\n        <div class=\"icon\">\n            <i class=\"{{item.icon}}\"></i>\n        </div>\n        <div class=\"description\" [ngClass]=\"{'openSidebar':sidebar._open, 'closeSidebar':!sidebar._open}\">\n            {{item.description}}\n        </div>\n        <div id=\"hint-{{item.id}}\" class=\"hintContainer\"  [@hintState]=\"hintState\">\n            <div class=\"hint\">{{item.description}}</div>\n        </div>\n    </div>\n</ng-template>\n",
                styles: [".formGroup{margin-bottom:10px}.formGroup label{width:100%}@-webkit-keyframes openSidebar{0%{width:40px}to{width:175px}}@keyframes openSidebar{0%{width:40px}to{width:175px}}@-webkit-keyframes closeSidebar{0%{width:175px}to{width:40px}}@keyframes closeSidebar{0%{width:175px}to{width:40px}}@-webkit-keyframes openSidebarDescription{0%{width:0}to{width:40px}}@keyframes openSidebarDescription{0%{width:0}to{width:40px}}@-webkit-keyframes closeSidebarDescription{0%{width:40px}to{width:0}}@keyframes closeSidebarDescription{0%{width:40px}to{width:0}}@-webkit-keyframes openSidebarIcon{0%{-webkit-transform:scale(1);transform:scale(1)}to{-webkit-transform:scale(-1);transform:scale(-1)}}@keyframes openSidebarIcon{0%{-webkit-transform:scale(1);transform:scale(1)}to{-webkit-transform:scale(-1);transform:scale(-1)}}@-webkit-keyframes closeSidebarIcon{0%{-webkit-transform:scale(-1);transform:scale(-1)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes closeSidebarIcon{0%{-webkit-transform:scale(-1);transform:scale(-1)}to{-webkit-transform:scale(1);transform:scale(1)}}#sidebar{color:#fff;height:100%;overflow-x:hidden;width:40px;background-color:#343a40;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;background-size:auto 100%}#sidebar.openSidebar{-webkit-animation-name:openSidebar;animation-name:openSidebar;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}#sidebar.closeSidebar{-webkit-animation-name:closeSidebar;animation-name:closeSidebar;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}#sidebar .bottomList,#sidebar .list{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;width:100%}#sidebar .bottomList.list,#sidebar .list.list{height:100%}#sidebar .bottomList .item,#sidebar .list .item{-webkit-box-shadow:none;box-shadow:none;-webkit-box-pack:left;-ms-flex-pack:left;justify-content:left;margin:0;border:none;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;padding-bottom:15px;padding-top:15px}#sidebar .bottomList .item:hover,#sidebar .list .item:hover{background-color:rgba(0,0,0,.5)}#sidebar .bottomList .item .hintContainer,#sidebar .list .item .hintContainer{position:absolute;overflow:hidden;left:40px;max-width:0;background-color:#1d2124;z-index:3}#sidebar .bottomList .item .hintContainer .hint,#sidebar .list .item .hintContainer .hint{color:#fff;padding:10px}#sidebar .bottomList .item .icon,#sidebar .list .item .icon{width:40px;text-align:center;font-size:1.5em}#sidebar .bottomList .item .description.openSidebar,#sidebar .list .item .description.openSidebar{-webkit-animation-name:openSidebarDescription;animation-name:openSidebarDescription;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}#sidebar .bottomList .item .description.closeSidebar,#sidebar .list .item .description.closeSidebar{-webkit-animation-name:closeSidebarDescription;animation-name:closeSidebarDescription;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}#sidebar .bottomList #toggleSidebar,#sidebar .list #toggleSidebar{background-color:rgba(0,0,0,.5)}#sidebar .bottomList #toggleSidebar .icon,#sidebar .list #toggleSidebar .icon{font-size:1em}#sidebar .bottomList #toggleSidebar.openSidebar,#sidebar .list #toggleSidebar.openSidebar{-webkit-animation-name:openSidebarIcon;animation-name:openSidebarIcon;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}#sidebar .bottomList #toggleSidebar.closeSidebar,#sidebar .list #toggleSidebar.closeSidebar{-webkit-animation-name:closeSidebarIcon;animation-name:closeSidebarIcon;-webkit-animation-duration:.2s;animation-duration:.2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}"],
                animations: [
                    trigger('hintState', [
                        state('open', style({
                            'max-width': '200px'
                        })),
                        state('close', style({
                            'max-width': '0'
                        })),
                        transition('open => close', animate('100ms ease-in')),
                        transition('close => open', animate('100ms ease-out'))
                    ])
                ]
            },] },
];
DefiSidebarComponent.ctorParameters = function () { return [
    { type: DefiSideBarService, },
]; };
DefiSidebarComponent.propDecorators = {
    "conf": [{ type: Input, args: ['conf',] },],
    "img": [{ type: Input, args: ['img',] },],
};
var DefiNavigationsModule = /** @class */ (function () {
    function DefiNavigationsModule() {
    }
    DefiNavigationsModule.forRoot = function () {
        return {
            ngModule: DefiNavigationsModule,
            providers: [
                DefiSideBarService,
            ]
        };
    };
    return DefiNavigationsModule;
}());
DefiNavigationsModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    DefiNavbarComponent,
                    DefiSidebarComponent
                ],
                exports: [
                    DefiNavbarComponent,
                    DefiSidebarComponent
                ],
            },] },
];
var DefiNotificationsService = /** @class */ (function () {
    function DefiNotificationsService() {
        this.notifications = [];
        this.addEvent = new Subject$1();
        this.removeEvent = new Subject$1();
        var notificationsDelay = +localStorage.getItem("notificationsDelay");
        if (notificationsDelay < 500) {
            notificationsDelay = 6000;
            localStorage.setItem("notificationsDelay", "6000");
        }
    }
    DefiNotificationsService.prototype.add = function (title, msg) {
        var notif = {
            id: v4(),
            title: title || "",
            msg: msg || ""
        };
        this.addEvent.next(notif);
        notif.timeout = this.defaultTimeout(notif);
        this.notifications.push(notif);
        return notif;
    };
    DefiNotificationsService.prototype.defaultTimeout = function (notif) {
        var _this = this;
        return setTimeout(function () {
            _this.delete(notif.id);
        }, +localStorage.getItem("notificationsDelay"));
    };
    DefiNotificationsService.prototype.updateNotif = function (id, _notif) {
        var _this = this;
        this.notifications.map(function (notif) {
            if (notif.id === id) {
                if (_notif.msg)
                    notif.msg = _notif.msg;
                if (_notif.title)
                    notif.title = _notif.title;
                clearTimeout(notif.timeout);
                notif.timeout = _this.defaultTimeout(notif);
            }
        });
    };
    DefiNotificationsService.prototype.delete = function (id) {
        this.removeEvent.next(id);
        this.notifications = this.notifications.filter(function (notif) { return notif.id !== id; });
    };
    DefiNotificationsService.prototype.deleteAll = function () {
        var _this = this;
        this.notifications.map(function (notif) { return _this.delete(notif.id); });
    };
    return DefiNotificationsService;
}());
DefiNotificationsService.decorators = [
    { type: Injectable },
];
DefiNotificationsService.ctorParameters = function () { return []; };
var DefiNotificationsComponent = /** @class */ (function () {
    function DefiNotificationsComponent(ns, renderer2) {
        var _this = this;
        this.ns = ns;
        this.renderer2 = renderer2;
        this._notifications = [];
        this.ns.addEvent.subscribe(function (data) { return _this._notifications.push(data); });
        this.ns.removeEvent.subscribe(function (id) { return _this.deleteNotif(id); });
    }
    DefiNotificationsComponent.prototype.deleteNotif = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            var htmlNotif;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHtmlNotif(id)];
                    case 1:
                        htmlNotif = _a.sent();
                        if (!htmlNotif)
                            return [2 /*return*/];
                        this.renderer2.addClass(htmlNotif, "deleteNotif");
                        setTimeout(function () {
                            _this._notifications = _this._notifications.filter(function (notif) { return notif.id !== id; });
                            resolve();
                        }, 500);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    DefiNotificationsComponent.prototype.deleteAll = function () {
        var _this = this;
        return each(this.htmlNotifications, function (htmlNotif) {
            _this.deleteNotif(htmlNotif.nativeElement.id);
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve();
                }, 50);
            });
        });
    };
    DefiNotificationsComponent.prototype.getHtmlNotif = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var htmlNotif;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, filter(this.htmlNotifications, function (htmlNotif) { return htmlNotif.nativeElement.id === id; })];
                    case 1:
                        htmlNotif = _a.sent();
                        if (htmlNotif.length)
                            return [2 /*return*/, htmlNotif.pop().nativeElement];
                        return [2 /*return*/];
                }
            });
        });
    };
    return DefiNotificationsComponent;
}());
DefiNotificationsComponent.decorators = [
    { type: Component, args: [{
                selector: "defi-notifications",
                template: "<div id=\"notifications\">\n    <div id=\"closeAll\" *ngIf='_notifications.length' (click)=\"deleteAll()\">\n        <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\n    </div>\n    <div class=\"notifsWrapper\">\n        <div class=\"notifWrapper\" (click)=\"ns.delete(notif.id)\" #notifModel *ngFor=\"let notif of _notifications\" [id]=\"notif.id\">\n            <div class=\"notifContainer\">\n                <div class=\"title\">\n                    {{notif.title}}\n                </div>\n                <div class=\"msg\">\n                    {{notif.msg}}\n                </div>\n            </div>\n        </div>\n    </div>\n</div>",
                styles: [".formGroup{margin-bottom:10px}.formGroup label{width:100%}@-webkit-keyframes openNotif{0%{max-height:0}to{max-height:400px}}@keyframes openNotif{0%{max-height:0}to{max-height:400px}}@-webkit-keyframes closeNotif{0%{max-height:400px}to{max-height:0}}@keyframes closeNotif{0%{max-height:400px}to{max-height:0}}#notifications{z-index:100000;position:fixed;bottom:20px;right:20px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}#notifications #closeAll{text-align:right}#notifications #closeAll i{font-size:1.7em;background-color:#343a40;color:#fff;padding:10px;-webkit-box-shadow:0 0 10px grey;box-shadow:0 0 10px grey}#notifications .notifWrapper{-webkit-animation-name:openNotif;animation-name:openNotif;-webkit-animation-duration:.4s;animation-duration:.4s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;overflow-y:hidden;-webkit-box-shadow:0 0 10px grey;box-shadow:0 0 10px grey;margin-top:10px;background-color:#343a40;color:#fff}#notifications .notifWrapper.deleteNotif{-webkit-animation-name:closeNotif;animation-name:closeNotif;-webkit-animation-duration:.4s;animation-duration:.4s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}#notifications .notifWrapper .notifContainer{padding:10px;width:400px}#notifications .notifWrapper .notifContainer .title{width:100%;border-bottom:1px solid #fff}#notifications .notifWrapper .notifContainer .msg{width:100%;padding-top:10px}"]
            },] },
];
DefiNotificationsComponent.ctorParameters = function () { return [
    { type: DefiNotificationsService, },
    { type: Renderer2, },
]; };
DefiNotificationsComponent.propDecorators = {
    "htmlNotifications": [{ type: ViewChildren, args: ['notifModel',] },],
};
var BodyDirective = /** @class */ (function () {
    function BodyDirective(templateRef) {
        this.templateRef = templateRef;
    }
    return BodyDirective;
}());
BodyDirective.decorators = [
    { type: Directive, args: [{
                selector: '[popup-body]'
            },] },
];
BodyDirective.ctorParameters = function () { return [
    { type: TemplateRef, },
]; };
var PopupComponent = /** @class */ (function () {
    function PopupComponent() {
        this.body = '';
        this.cancelButton = 'Annuler';
        this.validateButton = 'Valider';
        this.width = 'auto';
        this.height = 'auto';
        this.mainColor = '#343a40';
        this.noActions = false;
        this.openEvent = new EventEmitter();
        this._open = false;
        this.state = 'close';
    }
    PopupComponent.prototype.open = function (context) {
        var _this = this;
        this.context = context;
        this.result = new Subject$1();
        this._open = true;
        this.state = 'open';
        setTimeout(function (_) { return _this.openEvent.emit(); });
        return this.result;
    };
    PopupComponent.prototype.close = function ($event) {
        if ($event) {
            this.stopPropagation($event);
        }
        this._open = false;
        this.state = 'close';
        if (this.result) {
            this.result.unsubscribe();
            this.result = null;
        }
    };
    PopupComponent.prototype.bindForm = function (form) {
        this.form = form;
        return this;
    };
    PopupComponent.prototype.stopPropagation = function ($event) {
        $event.stopPropagation();
    };
    PopupComponent.prototype.out = function (isValidate, $event, value) {
        if ($event) {
            $event.preventDefault();
        }
        if (!isValidate)
            this.result.next(null);
        else if (this.form)
            this.result.next(this.form.value);
        else
            this.result.next(value || 'ok');
        this.close();
    };
    return PopupComponent;
}());
PopupComponent.decorators = [
    { type: Component, args: [{
                selector: 'popup',
                template: "<div class=\"popup\" (click)=\"close($event)\" [@openState]=\"state\" >\n  \n  <div class=\"popup-container\" *ngIf=_open [ngStyle]=\"{width:width, height:height}\" (click)=\"stopPropagation($event)\">\n    <div class=\"popup-title\" [ngStyle]=\"{'background-color':mainColor}\">\n      <ng-content select=\"[title]\"></ng-content>\n      <div *ngIf='title'>\n        {{title}}\n      </div> \n    </div>\n    <div class=\"popup-body\">\n      <div *ngIf='body;else bodyTemplateContainer'>\n        {{body}}\n      </div>\n      <ng-template #bodyTemplateContainer>\n        <ng-container [ngTemplateOutlet]=\"bodyTemplate?.templateRef\"></ng-container>\n      </ng-template>\n    </div>\n    <div class=\"popup-actions\" *ngIf='!noActions'>\n      <button class=\"popup-action popup-cancel\" (click)=\"out(false)\">{{cancelButton}}</button>\n      <button class=\"popup-action popup-ok\" [ngClass]=\"{'popup-disable': form?.invalid}\" [disabled]=\"form?.invalid\" (click)=\"out(true)\">{{validateButton}}</button>\n    </div>\n  </div>\n</div>",
                styles: [".popup{position:absolute;bottom:0;left:0;width:100vw;height:100vh;z-index:1000;background-color:rgba(0,0,0,.8);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;opacity:0}.popup .popup-container{-webkit-box-shadow:0 0 20px 1px #000;box-shadow:0 0 20px 1px #000;min-width:400px;background-color:#fff;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;max-height:100vh;max-width:100vw}.popup .popup-container .popup-title{background-color:#343a40;color:#fff;padding:10px}.popup .popup-container .popup-body{padding:10px;-webkit-box-flex:1;-ms-flex:1;flex:1;overflow-y:auto}.popup .popup-container .popup-body::ng-deep>.ng-star-inserted{height:100%}.popup .popup-container .popup-actions{display:-webkit-box;display:-ms-flexbox;display:flex}.popup .popup-container .popup-actions .popup-action{padding:10px;width:100%;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:#fff;cursor:pointer;border:none}.popup .popup-container .popup-actions .popup-action.popup-ok{background-color:#28a745}.popup .popup-container .popup-actions .popup-action.popup-cancel{background-color:#dc3545}.popup .popup-container .popup-actions .popup-action.popup-disable{background-color:#a2a2a2}"],
                animations: [
                    trigger('openState', [
                        state('open', style({
                            'display': 'flex',
                            'opacity': '1'
                        })),
                        state('close', style({
                            'display': 'none',
                            'opacity': '0'
                        })),
                        transition('open => close', animate('100ms ease-in')),
                        transition('close => open', animate('100ms ease-out'))
                    ])
                ]
            },] },
];
PopupComponent.propDecorators = {
    "bodyTemplate": [{ type: ContentChild, args: [BodyDirective,] },],
    "body": [{ type: Input },],
    "title": [{ type: Input },],
    "cancelButton": [{ type: Input },],
    "validateButton": [{ type: Input },],
    "width": [{ type: Input },],
    "height": [{ type: Input },],
    "mainColor": [{ type: Input },],
    "noActions": [{ type: Input },],
    "openEvent": [{ type: Output, args: ['openEvent',] },],
};
var DefiOverlayModule = /** @class */ (function () {
    function DefiOverlayModule() {
    }
    DefiOverlayModule.forRoot = function () {
        return {
            ngModule: DefiOverlayModule,
            providers: [
                DefiNotificationsService,
            ]
        };
    };
    return DefiOverlayModule;
}());
DefiOverlayModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    DefiNotificationsComponent,
                    PopupComponent,
                    BodyDirective
                ],
                exports: [
                    DefiNotificationsComponent,
                    PopupComponent,
                    BodyDirective
                ]
            },] },
];

export { DefiBoxComponent, DefiContainersModule, DefiSidePanelService, DefiSidePanelComponent, DefiCoreModule, DefiSpinningIconDirective, DefiClickStopPropagation, DefiToId, DefiPopoverComponent, DefiCommonService, DefiDebounceInputDirective, DefiShowPasswordDirective, DefiValidatorsDirective, DefiFormErrorsComponent, DefiFormsModule, DefiPassword, DefiNavbarComponent, DefiNavigationsModule, DefiSideBarService, DefiSidebarComponent, DefiNotificationsComponent, DefiOverlayModule, BodyDirective, PopupComponent, DefiNotificationsService };
//# sourceMappingURL=ngx-defi-core.js.map
