import PlanCard from './PlanCard'
import Steps from './Steps'
export default function SeeItInAction() {
  return (
    <section id="how-it-works" className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.15fr_1fr]">
      <PlanCard />
      <Steps />
    </section>
  )
}
