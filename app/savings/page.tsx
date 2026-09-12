import { Icon } from "@/components/Icon/Icon";
import { SavingsCalculator } from "@/components/SavingsCalculator/SavingsCalculator";

export default function SavingsPage() {
  return (
    <>
      <div className="pageHeader">
        <div className="pageHeaderText">
          <p className="kicker">
            <Icon name="piggy" size={14} />
            Luz w budżecie
          </p>
          <h1 className="pageTitle">Oszczędności</h1>
          <p className="pageLead">
            Rzeczy, które mogą poczekać albo są opcjonalne — zaznacz, co odłożyć,
            i zobacz, ile wraca do kieszeni.
          </p>
        </div>
      </div>
      <SavingsCalculator />
    </>
  );
}
