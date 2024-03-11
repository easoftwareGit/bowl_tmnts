import { TmntDataForm } from "./form";

export default function TmntDataPage() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <div className="shadow p-3 m-3 rounded-3 container">
        <h2 className="mb-3">Tournament Info</h2>
        <TmntDataForm />
      </div>
    </div>
  )
}