//准备数组: buf0, 意指: 未检查(未检查周围节点)
let buf0 = []
//起始, 开始节点为v_s, 设输入v_s的流为无穷大, 放入buf0
let v_s
v_s.mark[undefined, Infinity]
buf0.push(v_s)

function mark() {
  //对buf0每个节点遍历, 每个节点检查周围节点,
  buf0.forEach(V => {
    if (V !== undefined) {
      //周围节点保存在该节点的sourround属性, 为一个数组
      V.sourroud.forEach(v => {
        //每个节点对周围每个节点检查过程: 若有可用流量, 则标号该周围节点,
        if (v.hasCapacity) {
          //该节点的标号形式为一个只有两个元素的数组,
          //第一个元素为父节点(来自的节点),
          //第二个元素为一个最小值: 父节点与该节点可用流量, 父节点可用流量
          v.mark = [V, Math.min(V.mark[1])]
          //将该节点推入buf0
          buf0.push(v)
        }
      })
      //处理完成, 移除buf0, 放入buf1
      delete buf0[buf0.indexOf(V)]
      //继续处理buf0的元素
      mark()
    }
  })
}

mark()
