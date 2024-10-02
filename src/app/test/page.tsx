import { Suspense } from "react";
import TestRunner from "./TestRunner";

import { getLocalTest } from "@/actions/getLocalTest"

const test = getLocalTest()

export default function TestPage() {
  return <>
    <Suspense fallback={<p>Loading...</p>}>
      <TestRunner data={test}/>
    </Suspense>
  </>
}