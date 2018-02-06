import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import {BasicTemplateComponent} from './basic-template/basic-template.component';
import {ThemeService} from '../../../services/theme.service';
import {TEMPLATES} from '../../../../theme-module/themes';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {ActivatedRoute} from '@angular/router';
import {ComponentLoader, inputData} from '../../../component-loader.decorator';

@Component({
  selector: 'custom-content',
  template: `
    <div #dynamicComponentContainer></div>
  `,
  styleUrls: ['./custom-page.component.css'],
  inputs: ['dynamicComponentContainer']
})
export class CustomContentComponent {
  templateName = 'BasicTemplateComponent';
  page;
  link;
  userConfig;
  combinedObs;
  sub;
  currentComponent = null;

  @ViewChild('dynamicComponentContainer', {read: ViewContainerRef}) dynamicComponentContainer: ViewContainerRef;

  @ComponentLoader()
  @Input() set componentData(@inputData data: { component: any, inputs: any }) {
  }

  constructor(private resolver: ComponentFactoryResolver, private themeService: ThemeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const currentUser = this.themeService.getCurrentUser();
    const currentPage = this.route.params;

    currentUser
      .switchMap(data => this.userConfig = this.themeService.getUserConfig(data._id))
      .subscribe(() => {
        this.combinedObs = combineLatest(currentPage, currentUser, this.userConfig);
        this.sub = this.combinedObs.subscribe(info => {
          this.page = info[0]['link'];
          this.templateName = info[2]['pages'][this.page]['templateName'];
          this.applyTemplate();
        });
      });

    this.themeService.applyTemplate.subscribe(data => {
      this.templateName = data;
      this.applyTemplate();
    }, (error: string) => {
      console.error(error);
    });
  }

  applyTemplate() {
    this.componentData = {
      component: TEMPLATES[this.templateName],
      inputs: {}
    };
  }
}
