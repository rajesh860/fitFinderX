import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../../theme/colors';

const PlanTab = ({width,gymData}) => {
    const planStyle = [
    { name: "basic", bgColor: "rgba(230, 244, 255, 0.8)", borderColor: "#91caff", color: "#0958d9" },
    { name: "silver", bgColor: COLORS.gray700, borderColor: "transparent", color: COLORS.textPrimary },
    { name: "gold", bgColor: "#fffbe6", borderColor: "#ffe58f", color: "#d48806" },
  ];
  return (
      <View style={{ width }}>
               <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 4 }}>
                 <Text style={styles.sectionTitle}>Membership Plans</Text>
                 {gymData?.data?.plans?.map((plan: any, idx: number) => {
                   const style = planStyle[idx % planStyle.length];
                   return (
                     <Card key={idx} style={[styles.planBox, {  backgroundColor: "#1e293b", borderColor: style.borderColor, borderWidth: 1 }]} onPress={() => navigation.navigate("planDetail", { planId: plan?.planId })}>
                       <Card.Content style={styles.planRow}>
                         <View>
                           <Text style={[styles.planTitle, { color: COLORS.gray100 }]}>{plan.planName}</Text>
                           <Text style={[styles.planDesc, { color: COLORS.gray100 }]}>View More</Text>
                         </View>
                         <View style={{ alignItems: "flex-end" }}>
                           <Text style={[styles.planPrice, { color: COLORS.gray100 }]}>{plan.price}/month</Text>
                           {plan.tag && <Text style={[styles.popularTag, { backgroundColor: COLORS.gray100 }]}>{plan.tag}</Text>}
                         </View>
                       </Card.Content>
                     </Card>
                   );
                 })}
               </ScrollView>
             </View>
  )
}

export default PlanTab


const styles = StyleSheet.create({
      sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 12, marginBottom: 14, color: COLORS.textPrimary },
      planBox: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginBottom: 14,
        elevation: 2,
      },
      planRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
      planTitle: { fontSize: 18, fontWeight: "600", color: COLORS.textPrimary },
      planDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2, fontWeight: 'bold' },
      planPrice: { fontSize: 15, fontWeight: "700", color: COLORS.textPrimary },

       popularTag: {
    backgroundColor: COLORS.success,
    color: COLORS.textPrimary,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    fontSize: 12,
  },
})