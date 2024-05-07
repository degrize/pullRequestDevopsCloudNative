import {AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {AssociationDTO, Member, Minute} from "../../entities/association/association.model";
import {Router} from "@angular/router";
import {Accordion, AccordionInterface, AccordionItem} from "flowbite";

@Component({
  selector: 'app-users-detail-accordion',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    TitleCasePipe
  ],
  templateUrl: './users-detail-accordion.component.html',
  styleUrl: './users-detail-accordion.component.css'
})
export class UsersDetailAccordionComponent implements OnInit, AfterViewInit {

  @Input()
  currentUserId!: number;
  @Input()
  associations!: AssociationDTO[];

  @ViewChild('accordion') accordionElem!: ElementRef<HTMLElement>;
  @ViewChildren('accordionHeads') accordionHeads!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('accordionBodies') accordionBodies!: QueryList<ElementRef<HTMLElement>>;
  accordion!: AccordionInterface;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const accordionEl: HTMLElement = this.accordionElem.nativeElement;
    const accordionItems: AccordionItem[] = [];
    for (let i = 0; i < this.associations.length; i++) {
      accordionItems.push({
        id: 'accordion-heading-' + this.associations[i].id,
        triggerEl: this.accordionHeads.get(i)?.nativeElement as HTMLElement,
        targetEl: this.accordionBodies.get(i)?.nativeElement as HTMLElement,
        active: false,
      });
    }

    this.accordion = new Accordion(accordionEl, accordionItems);
  }

  navigateToAssociation(associationId: number): void {
    this.router.navigateByUrl('/associations/detail/' + associationId);
  }

  getRoleInAssociation(associationId: number): string {
    if (!this.associations) {
      return "";
    }

    // Récupère l'association correspondant à l'id donné
    const associations: AssociationDTO[] = this.associations.filter((asso: AssociationDTO) => asso.id === associationId);
    if (associations.length <= 0) {
      return "";
    }
    const association: AssociationDTO = this.associations[0];

    // Récupère le membre correspondant à l'utilisateur courant
    const members: Member[] = association.members.filter((mem: Member) => mem.id === this.currentUserId);
    return members.length > 0 ? members[0].role : "";
  }

  getMinutesVotedInAssociation(associationId: number): Minute[] {
    if (!this.associations) {
      return [];
    }

    // Récupère l'association correspondant à l'id donné
    if (this.associations) {
      const associations: AssociationDTO[] = this.associations.filter((asso: AssociationDTO) => asso.id === associationId);
      if (associations.length <= 0) {
        return [];
      }
      const association: AssociationDTO = associations[0];

      // Récupère les minutes pour lesquelles l'utilisateur courant a voté
      const minutes: Minute[] = association.minutes.filter((minute: Minute) => {
        if (this.currentUserId != null) {
          return minute.voters.includes(this.currentUserId)
        }
        return false;
      });
      return minutes;
    }
    return [];
  }
}
