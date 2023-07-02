export default function TriggerCelds({data}) {
    return (
        <div className={"triggerCeld" + ` ${data.status}`} data-celd-id={data.celdId}></div>
    )
}