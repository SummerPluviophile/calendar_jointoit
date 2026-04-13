import { CalendarWrapper } from "./components/Calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {
  return (
    <div className="py-8 px-20 flex flex-col mx-26 my-4 shadow-md bg-component-background">
      <h1 className="text-2xl inline-block">Calendar view</h1>
      <CalendarWrapper classNames={""} />
    </div>
  );
}
