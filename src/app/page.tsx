import { RadioGroupForm, RadioGroupFormProps } from "@/components/base/radioGroup";
import { RadioValues } from "@/validation/formSchema";
import ExamOrPractice from "./examOrPractice";

export default function Home() {
  
  return (
    <>
        <h2 className='font-bold text-3xl'>Start your Mass CSL Practice Exam</h2>
        <p className='text-xl'>Would you like to practice or take an exam?</p>
        <ExamOrPractice />
    </>
  );
}
