import { Problem } from "../../../../types"
import GenericTable, { Column } from "../../../../components/GenericTable/GenericTable"
import TagList from "../../../../components/TagList/TagList"
import ProblemStatus from "../../../../components/ProblemStatus/PtoblemStatus"

const columns: Array<Column<Problem>> = [
  { name: "name", readableName: "Название", sortable: true, content: p => p.name },
  { name: "tags", readableName: "Теги", sortable: false, content: p => <TagList tags={p.tags}/>},
  { name: "tryCount", readableName: "Количество попыток", sortable: true, content: p => p.userSolutionInfo?.tryCount || 0 },
  { name: "problemStatus", readableName: "Статус", sortable: true, content: p => <ProblemStatus solutionInfo={p.userSolutionInfo}/> },

]

const ProblemList = ({ problems }: { problems: Array<Problem> }) => {
  return <div>
    <h2>Задачи</h2>
    <GenericTable columns={columns} pageSize={5} keyExtractor={p => p.id}
                  // linkExtractor={p => `problems/${p.id}`}
      linkExtractor={null}
                  data={problems}
                  hideHeader={false}/>
  </div>
}

export default ProblemList
