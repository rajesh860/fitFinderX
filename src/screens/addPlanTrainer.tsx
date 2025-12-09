import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Card,
  Text,
  Chip,
  IconButton,
  Button,
  Surface,
  Switch,
} from "react-native-paper";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { COLORS } from "../theme/colors"; // import your COLORS object

export default function AddPlanScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const trainerId = route.params?.trainerId; // expects trainerId passed in navigation

  // form state
  const [name, setName] = useState("");
  const [durationMonths, setDurationMonths] = useState<number | null>(1);
  const [price, setPrice] = useState<string>(""); // as string to control input
  const [description, setDescription] = useState("");
  const [benefitText, setBenefitText] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // quick durations for UI
  const QUICK_DURATIONS = [1, 3, 6];

  const addBenefit = () => {
    const b = benefitText.trim();
    if (!b) return;
    setBenefits((prev) => (prev.includes(b) ? prev : [...prev, b]));
    setBenefitText("");
    Keyboard.dismiss();
  };

  const removeBenefit = (b: string) => {
    setBenefits((prev) => prev.filter((x) => x !== b));
  };

  const previewPrice = useMemo(() => {
    const n = Number(price);
    if (Number.isFinite(n) && n > 0) return n;
    return 0;
  }, [price]);

  const validate = () => {
    if (!trainerId) {
      Toast.show({ type: "error", text1: "Missing Trainer", text2: "Trainer ID not found." });
      return false;
    }
    if (!name.trim()) {
      Toast.show({ type: "error", text1: "Validation", text2: "Plan name is required." });
      return false;
    }
    if (!durationMonths || durationMonths <= 0) {
      Toast.show({ type: "error", text1: "Validation", text2: "Choose a duration." });
      return false;
    }
    if (!price || Number(price) <= 0) {
      Toast.show({ type: "error", text1: "Validation", text2: "Enter a valid price." });
      return false;
    }
    return true;
  };

  const handleCreatePlan = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const body = {
        name: name.trim(),
        durationMonths,
        price: Number(price),
        description: description.trim(),
        benefits,
      };

      // adjust baseURL / token as per your app (placeholder below)
      const token = ""; // e.g. get from secure store / redux / context
      const res = await fetch(`/api/trainers/${trainerId}/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json?.message || json?.error || "Failed to create plan";
        throw new Error(msg);
      }

      Toast.show({
        type: "success",
        text1: "Plan created",
        text2: json?.message || "Plan was created successfully.",
      });

      // optional: navigate back or to plan list
      navigation.goBack();
    } catch (err: any) {
      console.error("Create plan error:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message || "Unable to create plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Create New Plan</Text>
          <IconButton
            icon="close"
            size={22}
            iconColor={COLORS.textSecondary}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* Form Card */}
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              mode="outlined"
              label="Plan Name"
              placeholder="e.g. 3 Month Transformation"
              value={name}
              onChangeText={setName}
              style={styles.input}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.primary}
              left={<TextInput.Icon icon="tag-outline" />}
              theme={{ colors: { text: COLORS.textPrimary } }}
            />

            <View style={{ flexDirection: "row", marginTop: 12, alignItems: "center" }}>
              <Text style={styles.fieldLabel}>Duration</Text>
              <View style={{ flexDirection: "row", marginLeft: 12 }}>
                {QUICK_DURATIONS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDurationMonths(d)}
                    style={[
                      styles.durationPill,
                      durationMonths === d && { backgroundColor: COLORS.primary },
                    ]}
                  >
                    <Text style={[styles.durationText, durationMonths === d && { color: "#000" }]}>
                      {d} {d === 1 ? "month" : "months"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              mode="outlined"
              label="Price"
              placeholder="Enter price (numbers only)"
              value={price}
              onChangeText={(t) => setPrice(t.replace(/[^0-9.]/g, ""))}
              keyboardType="numeric"
              style={[styles.input, { marginTop: 12 }]}
              left={<TextInput.Icon icon="currency-inr" />}
              theme={{ colors: { text: COLORS.textPrimary } }}
            />

            <TextInput
              mode="outlined"
              label="Short Description"
              placeholder="Brief about this plan"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { marginTop: 12 }]}
              multiline
              numberOfLines={3}
              theme={{ colors: { text: COLORS.textPrimary } }}
            />

            {/* Benefits input */}
            <View style={{ marginTop: 12 }}>
              <Text style={styles.fieldLabel}>Benefits</Text>
              <View style={styles.benefitRow}>
                <TextInput
                  mode="outlined"
                  placeholder="Add benefit and press +"
                  value={benefitText}
                  onChangeText={setBenefitText}
                  style={styles.benefitInput}
                  theme={{ colors: { text: COLORS.textPrimary } }}
                />
                <IconButton
                  icon="plus"
                  size={20}
                  onPress={addBenefit}
                  style={styles.addBenefitBtn}
                  iconColor="#fff"
                />
              </View>

              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {benefits.map((b) => (
                  <Chip
                    key={b}
                    onClose={() => removeBenefit(b)}
                    style={styles.benefitChip}
                    textStyle={{ color: COLORS.textPrimary }}
                    closeIcon="close"
                  >
                    {b}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Active switch */}
            <View style={styles.switchRow}>
              <Text style={styles.fieldLabel}>Plan Active</Text>
              <Switch value={isActive} onValueChange={setIsActive} color={COLORS.primary} />
            </View>

            {/* Preview */}
            <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Preview</Text>
            <Surface style={styles.previewCard}>
              <View style={styles.previewTop}>
                <View>
                  <Text style={styles.previewName}>{name || "Plan name"}</Text>
                  <Text style={styles.previewMeta}>
                    {durationMonths} {durationMonths === 1 ? "month" : "months"} • ₹{previewPrice}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Chip style={styles.previewChip}>{isActive ? "ACTIVE" : "INACTIVE"}</Chip>
                </View>
              </View>

              <Text style={styles.previewDescription}>
                {description || "Short description will appear here."}
              </Text>

              <View style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {benefits.length ? (
                  benefits.map((b) => (
                    <Chip key={b} style={styles.benefitPreviewChip}>
                      {b}
                    </Chip>
                  ))
                ) : (
                  <Text style={{ color: COLORS.textSecondary }}>No benefits added</Text>
                )}
              </View>
            </Surface>

            {/* Submit */}
            <Button
              mode="contained"
              onPress={handleCreatePlan}
              loading={loading}
              disabled={loading}
              style={{ marginTop: 18, borderRadius: 10 }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Create Plan
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: COLORS.textPrimary, fontSize: 20, fontWeight: "700" },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: "transparent",
  },
  fieldLabel: { color: COLORS.textSecondary, fontSize: 13, fontWeight: "600" },
  durationPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  durationText: { color: COLORS.textSecondary, fontWeight: "700" },
  benefitRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  benefitInput: { flex: 1, backgroundColor: "transparent" },
  addBenefitBtn: {
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  benefitChip: {
    backgroundColor: COLORS.gray800,
    marginTop: 8,
    marginRight: 8,
  },
  switchRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewCard: {
    marginTop: 10,
    backgroundColor: "#0F1720",
    padding: 12,
    borderRadius: 12,
  },
  previewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewName: { color: COLORS.textPrimary, fontSize: 16, fontWeight: "800" },
  previewMeta: { color: COLORS.textSecondary, marginTop: 4 },
  previewChip: { backgroundColor: "#FFD700", color: "#000" },
  previewDescription: { color: COLORS.textSecondary, marginTop: 8 },
  benefitPreviewChip: {
    backgroundColor: COLORS.gray800,
    marginRight: 8,
    marginTop: 8,
  },
});
