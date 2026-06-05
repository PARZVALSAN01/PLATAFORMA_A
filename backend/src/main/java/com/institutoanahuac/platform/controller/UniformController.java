package com.institutoanahuac.platform.controller;

import com.institutoanahuac.platform.entity.Uniform;
import com.institutoanahuac.platform.entity.UniformSale;
import com.institutoanahuac.platform.entity.Student;
import com.institutoanahuac.platform.repository.UniformRepository;
import com.institutoanahuac.platform.repository.UniformSaleRepository;
import com.institutoanahuac.platform.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/uniforms")
@RequiredArgsConstructor
public class UniformController {

    private final UniformRepository uniformRepo;
    private final UniformSaleRepository saleRepo;
    private final StudentRepository studentRepo;

    // ---- CRUD Uniformes ----

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<Uniform>> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(uniformRepo.search(search));
        }
        return ResponseEntity.ok(uniformRepo.findByIsActiveTrueOrderByNombreAsc());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Uniform> create(@RequestBody Uniform uniform) {
        return ResponseEntity.status(HttpStatus.CREATED).body(uniformRepo.save(uniform));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Uniform> update(@PathVariable Long id, @RequestBody Uniform data) {
        Uniform u = uniformRepo.findById(id).orElseThrow(() -> new RuntimeException("Uniforme no encontrado"));
        u.setNombre(data.getNombre());
        u.setTalla(data.getTalla());
        u.setPrecio(data.getPrecio());
        u.setStock(data.getStock());
        u.setCategoria(data.getCategoria());
        u.setNivel(data.getNivel());
        u.setGenero(data.getGenero());
        u.setDescripcion(data.getDescripcion());
        return ResponseEntity.ok(uniformRepo.save(u));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        Uniform u = uniformRepo.findById(id).orElseThrow();
        u.setIsActive(false);
        uniformRepo.save(u);
        return ResponseEntity.ok(Map.of("message", "Uniforme desactivado"));
    }

    // ---- Ventas ----

    @GetMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getSales(@RequestParam(required = false) String estado) {
        List<UniformSale> sales = estado != null && !estado.isBlank()
            ? saleRepo.findByEstadoOrderByCreatedAtDesc(estado)
            : saleRepo.findAll();

        List<Map<String, Object>> result = sales.stream().map(s -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", s.getId());
            map.put("uniformId", s.getUniform().getId());
            map.put("uniformName", s.getUniform().getNombre());
            map.put("uniformTalla", s.getUniform().getTalla());
            map.put("studentId", s.getStudent().getId());
            map.put("studentName", s.getStudent().getUser().getFirstName() + " " + s.getStudent().getApellidoPaterno());
            map.put("studentMatricula", s.getStudent().getMatricula());
            map.put("cantidad", s.getCantidad());
            map.put("precioUnitario", s.getPrecioUnitario());
            map.put("total", s.getTotal());
            map.put("estado", s.getEstado());
            map.put("createdAt", s.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping("/sales")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> createSale(@RequestBody Map<String, Object> body) {
        Long uniformId = Long.valueOf(body.get("uniformId").toString());
        Long studentId = Long.valueOf(body.get("studentId").toString());
        int cantidad = Integer.parseInt(body.get("cantidad").toString());

        Uniform uniform = uniformRepo.findById(uniformId).orElseThrow(() -> new RuntimeException("Uniforme no encontrado"));
        Student student = studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        if (uniform.getStock() < cantidad) {
            return ResponseEntity.badRequest().body(Map.of("message", "Stock insuficiente"));
        }

        UniformSale sale = UniformSale.builder()
            .uniform(uniform)
            .student(student)
            .cantidad(cantidad)
            .precioUnitario(uniform.getPrecio())
            .total(uniform.getPrecio().multiply(BigDecimal.valueOf(cantidad)))
            .estado(body.getOrDefault("estado", "pendiente").toString())
            .build();
        saleRepo.save(sale);

        uniform.setStock(uniform.getStock() - cantidad);
        uniformRepo.save(uniform);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Venta registrada"));
    }

    @PutMapping("/sales/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> updateSaleStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        UniformSale sale = saleRepo.findById(id).orElseThrow();
        sale.setEstado(body.get("estado"));
        saleRepo.save(sale);
        return ResponseEntity.ok(Map.of("message", "Estado actualizado"));
    }

    // ---- Dashboard Stats ----

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUniformes", uniformRepo.findByIsActiveTrueOrderByNombreAsc().size());
        stats.put("totalPagado", saleRepo.totalPagado());
        stats.put("totalPendiente", saleRepo.totalPendiente());
        stats.put("totalGeneral", saleRepo.totalGeneral());
        stats.put("totalVentas", saleRepo.count());
        return ResponseEntity.ok(stats);
    }

    // ---- Bulk import ----

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> bulkImport(@RequestBody List<Map<String, Object>> items) {
        int imported = 0;
        int errors = 0;
        List<String> errorMessages = new ArrayList<>();

        for (Map<String, Object> item : items) {
            try {
                Uniform u = Uniform.builder()
                    .nombre(item.get("nombre").toString())
                    .talla(item.get("talla").toString())
                    .precio(new BigDecimal(item.get("precio").toString()))
                    .stock(Integer.parseInt(item.get("stock").toString()))
                    .categoria(item.getOrDefault("categoria", "").toString())
                    .nivel(item.getOrDefault("nivel", "").toString())
                    .genero(item.getOrDefault("genero", "").toString())
                    .descripcion(item.getOrDefault("descripcion", "").toString())
                    .build();
                uniformRepo.save(u);
                imported++;
            } catch (Exception e) {
                errors++;
                errorMessages.add("Fila " + (imported + errors) + ": " + e.getMessage());
            }
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("imported", imported);
        result.put("errors", errors);
        result.put("errorMessages", errorMessages);
        return ResponseEntity.ok(result);
    }
}
